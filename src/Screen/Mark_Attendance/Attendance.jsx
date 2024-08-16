import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../../Component/Navigation/Navbar';
import './Attendance.css';

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
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

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
        const setupCamera = (selectedCamera, videoRef) => {
            if (selectedCamera) {
                navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCamera } })
                    .then(stream => {
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                        }
                    })
                    .catch(err => console.error("Error accessing webcam: ", err));
            }
        };

        setupCamera(selectedInCamera, inVideoRef);
        setupCamera(selectedOutCamera, outVideoRef);

        return () => {
            if (wsIn) wsIn.close();
            if (wsOut) wsOut.close();
            if (inIntervalRef.current) clearInterval(inIntervalRef.current);
            if (outIntervalRef.current) clearInterval(outIntervalRef.current);
        };
    }, [selectedInCamera, selectedOutCamera, wsIn, wsOut]);

    const startWebSocket = (type) => {
        const wsUrl = `ws://localhost:8000/ws/attendance_${type}/1/`;
        let ws;
        const statusUpdater = type === 'in' ? setInStatus : setOutStatus;
        const frameUpdater = type === 'in' ? inFrameRef : outFrameRef;
        const intervalRef = type === 'in' ? inIntervalRef : outIntervalRef;
        const videoRef = type === 'in' ? inVideoRef : outVideoRef;

        const connect = () => {
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log(`WebSocket ${type} opened`);
                statusUpdater(`WebSocket ${type} connection established.`);
                intervalRef.current = startSendingFrames(ws, videoRef, type);
            };

            ws.onmessage = (event) => {
                const img = new Image();
                img.src = 'data:image/jpeg;base64,' + event.data;
                if (frameUpdater.current) {
                    frameUpdater.current.src = img.src;
                }
                statusUpdater(`Attendance ${type.charAt(0).toUpperCase() + type.slice(1)} Successful!`);
            };

            ws.onclose = () => {
                console.log(`WebSocket ${type} closed, retrying...`);
                statusUpdater(`WebSocket ${type} connection closed, retrying...`);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
                setTimeout(connect, Math.random() * 2000 + 1000);
            };

            ws.onerror = (error) => {
                console.error(`WebSocket ${type} error:`, error);
                statusUpdater(`WebSocket ${type} encountered an error.`);
            };

            type === 'in' ? setWsIn(ws) : setWsOut(ws);
        };

        connect();
    };

    const startSendingFrames = (ws, videoRef, type) => {
        const canvas = document.createElement('canvas');

        const sendFrame = () => {
            if (ws.readyState === WebSocket.OPEN && videoRef.current.readyState === 4) {
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                const frameData = dataUrl.replace('data:image/jpeg;base64,', '');
                ws.send(frameData);
            }
        };

        return setInterval(sendFrame, 100);
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

    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="attendance-container">
                <div className="camera-selection">
                    <label htmlFor="inCameraSelect">Select Camera for Attendance In:</label>
                    <select id="inCameraSelect" value={selectedInCamera} onChange={handleInCameraChange}>
                        {cameras.map(camera => (
                            <option key={camera.deviceId} value={camera.deviceId} disabled={camera.deviceId === selectedOutCamera}>
                                {camera.label || `Camera ${camera.deviceId}`}
                            </option>
                        ))}
                    </select>
                </div>
                <video ref={inVideoRef} autoPlay></video>

                <div className="camera-selection">
                    <label htmlFor="outCameraSelect">Select Camera for Attendance Out:</label>
                    <select id="outCameraSelect" value={selectedOutCamera} onChange={handleOutCameraChange}>
                        {cameras.map(camera => (
                            <option key={camera.deviceId} value={camera.deviceId} disabled={camera.deviceId === selectedInCamera}>
                                {camera.label || `Camera ${camera.deviceId}`}
                            </option>
                        ))}
                    </select>
                </div>
                <video ref={outVideoRef} autoPlay></video>

                <div id="buttons">
                    <button onClick={() => {
                        if (wsIn) wsIn.close();
                        startWebSocket('in');
                    }}>Start Attendance In</button>
                    <button onClick={() => {
                        if (wsOut) wsOut.close();
                        startWebSocket('out');
                    }}>Start Attendance Out</button>
                </div>

                <div>
                    <img ref={inFrameRef} alt="Attendance In Recognition Result" data-type="in" />
                    <p>{inStatus}</p>
                </div>

                <div>
                    <img ref={outFrameRef} alt="Attendance Out Recognition Result" data-type="out" />
                    <p>{outStatus}</p>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
