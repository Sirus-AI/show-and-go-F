import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Component/Navigation/Navbar';
import './Attendance.css';
import { WEBSOCKET_URL } from '../../Server';

const Attendance = () => {
    const [wsIn, setWsIn] = useState(null);
    const [wsOut, setWsOut] = useState(null);
    const [inStatus, setInStatus] = useState('');
    const [outStatus, setOutStatus] = useState('');
    const [cameras, setCameras] = useState([]);
    const [selectedInCamera, setSelectedInCamera] = useState('');
    const [selectedOutCamera, setSelectedOutCamera] = useState('');
    const inVideoRef = useRef(null);
    const outVideoRef = useRef(null);
    const inFrameRef = useRef(null);
    const outFrameRef = useRef(null);
    const inIntervalRef = useRef(null);
    const outIntervalRef = useRef(null);
    const inStreamRef = useRef(null);
    const outStreamRef = useRef(null);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    let userData = localStorage.getItem('userData');
    userData = JSON.parse(userData);
    const orgId = userData.org_id;
    
    useEffect(() => {
        const getCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setCameras(videoDevices);
                if (videoDevices.length > 0) {
                    setSelectedInCamera(videoDevices[0].deviceId);
                    setSelectedOutCamera(videoDevices[1] ? videoDevices[1].deviceId : '');
                }
            } catch (err) {
                console.error('Error enumerating devices: ', err);
            }
        };

        getCameras();
    }, []);

    useEffect(() => {
        const setupCamera = (selectedCamera, videoRef, streamRef) => {
            if (selectedCamera) {
                navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCamera } })
                    .then(stream => {
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                            streamRef.current = stream; // Store the media stream for later stopping
                        }
                    })
                    .catch(err => console.error("Error accessing webcam: ", err));
            }
        };

        // Setup both cameras
        setupCamera(selectedInCamera, inVideoRef, inStreamRef);
        setupCamera(selectedOutCamera, outVideoRef, outStreamRef);

        return () => {
            // Stop the cameras and close WebSocket when the component is unmounted
            stopStream(inStreamRef);
            stopStream(outStreamRef);
            if (wsIn) wsIn.close();
            if (wsOut) wsOut.close();
            if (inIntervalRef.current) clearInterval(inIntervalRef.current);
            if (outIntervalRef.current) clearInterval(outIntervalRef.current);
        };
    }, [selectedInCamera, selectedOutCamera]);

    const startWebSocket = (type) => {
        const wsUrl = `${WEBSOCKET_URL}ws/attendance_${type}/${orgId}/`;
        const statusUpdater = type === 'in' ? setInStatus : setOutStatus;
        const frameUpdater = type === 'in' ? inFrameRef : outFrameRef;
        const intervalRef = type === 'in' ? inIntervalRef : outIntervalRef;
        const videoRef = type === 'in' ? inVideoRef : outVideoRef;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log(`[${type}] WebSocket opened at ${new Date().toISOString()}`);
            statusUpdater(`You are now connected for Attendance ${type === 'in' ? 'In' : 'Out'}.`);
            intervalRef.current = startSendingFrames(ws, videoRef);
        };

        ws.onmessage = (event) => {
            console.log(`[${type}] WebSocket received message at ${new Date().toISOString()}`);
            const img = new Image();
            img.src = 'data:image/jpeg;base64,' + event.data;
            if (frameUpdater.current) {
                frameUpdater.current.src = img.src;
            }
            statusUpdater(`Attendance ${type === 'in' ? 'In' : 'Out'} has been recorded successfully.`);
        };

        ws.onclose = () => {
            console.log(`[${type}] WebSocket closed at ${new Date().toISOString()}`);
            statusUpdater(`The connection for Attendance ${type === 'in' ? 'In' : 'Out'} is now closed.`);
            stopStream(type === 'in' ? inStreamRef : outStreamRef); // Stop the camera
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

        ws.onerror = (error) => {
            console.error(`[${type}] WebSocket error at ${new Date().toISOString()}:`, error);
            statusUpdater('There was an issue with the connection. Please try again.');
        };

        if (type === 'in') {
            setWsIn(ws);
        } else {
            setWsOut(ws);
        }
    };

    const startSendingFrames = (ws, videoRef) => {
        const canvas = document.createElement('canvas');

        const sendFrame = () => {
            if (ws.readyState === WebSocket.OPEN && videoRef.current && videoRef.current.readyState === 4) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                const frameData = dataUrl.replace('data:image/jpeg;base64,', '');
                ws.send(frameData);
            }
        };

        return setInterval(sendFrame, 1000);
    };

    const stopStream = (streamRef) => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop()); // Stop all media tracks
            streamRef.current = null; // Clear the stream reference
        }
    };

    const handleInCameraChange = (e) => {
        const selectedCamera = e.target.value;
        setSelectedInCamera(selectedCamera);
        if (selectedCamera === selectedOutCamera) {
            setSelectedOutCamera('');
        }
    };

    const handleOutCameraChange = (e) => {
        const selectedCamera = e.target.value;
        setSelectedOutCamera(selectedCamera);
        if (selectedCamera === selectedInCamera) {
            setSelectedInCamera('');
        }
    };

    const closeWebSocketConnectionsIn = () => {
        if (wsIn) {
            wsIn.close();
            setInStatus('Attendance In connection has been stopped.');
        }
    };

    const closeWebSocketConnectionsOut = () => {
        if (wsOut) {
            wsOut.close();
            setOutStatus('Attendance Out connection has been stopped.');
        }
    };

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <div className='attendance-content'>
                <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                    <div className="attendance-container">
                        <div className="camera-selection">
                            <label htmlFor="inCameraSelect">Select Camera for Attendance In:</label>
                            <select className="inCameraSelect" id="inCameraSelect" value={selectedInCamera} onChange={handleInCameraChange}>
                                {cameras.map(camera => (
                                    <option key={camera.deviceId} value={camera.deviceId} disabled={camera.deviceId === selectedOutCamera}>
                                        {camera.label || `Camera ${camera.deviceId}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="Attendance-video"> <video ref={inVideoRef} autoPlay></video></div>

                        <div className="camera-selection">
                            <label htmlFor="outCameraSelect">Select Camera for Attendance Out:</label>
                            <select id="outCameraSelect" className="inCameraSelect" value={selectedOutCamera} onChange={handleOutCameraChange}>
                                {cameras.map(camera => (
                                    <option key={camera.deviceId} value={camera.deviceId} disabled={camera.deviceId === selectedInCamera}>
                                        {camera.label || `Camera ${camera.deviceId}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="Attendance-video">  <video ref={outVideoRef} autoPlay></video></div>

                        <div id="buttons">
                            <button className="Start-Attendance-in" onClick={() => {
                                if (wsIn) wsIn.close();
                                startWebSocket('in');
                            }}>Start Attendance In</button>
                            <button className="Start-Attendance-out" onClick={() => {
                                if (wsOut) wsOut.close();
                                startWebSocket('out');
                            }}>Start Attendance Out</button>
                            <button className="Stop-Attendance-In" onClick={closeWebSocketConnectionsIn}>Stop Attendance In</button>
                            <button className="Stop-Attendance-out" onClick={closeWebSocketConnectionsOut}>Stop Attendance Out</button>
                        </div>

                        <div>
                            <img ref={inFrameRef} alt="Attendance In Recognition Result" />
                            <p>{inStatus}</p>
                        </div>

                        <div>
                            <img ref={outFrameRef} alt="Attendance Out Recognition Result" />
                            <p>{outStatus}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
