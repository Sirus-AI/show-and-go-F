import React, { useState, useRef } from 'react';
import './Captureface.css';
import Navbar from '../../Component/Navigation/Navbar';
import { WEBSOCKET_URL } from '../../Server';

const Captureface = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [processedImageSrc, setProcessedImageSrc] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0); 
  const socketRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoStreamRef = useRef(null);

  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const connectWebSocket = () => {
    if (!email) {
      alert('Please enter an email.');
      return;
    }

    socketRef.current = new WebSocket(`${WEBSOCKET_URL}ws/face_capture/`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connection opened.');
      setStatus('Connected to WebSocket');
      socketRef.current.send(JSON.stringify({ email }));
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data.percentage);

        // Update status and percentage
        if (data.status) {
          setStatus(data.status);
          if (data.status === 'collection_complete') {
            alert('Face data collection complete.');
            stopCapture();
          }
        } else if (data.error) {
          setStatus(data.error);
        }

        if (data.percentage) {
          setProgressPercentage(data.percentage+2); 
        }
        if (data.bytes) {
          setProcessedImageSrc('data:image/jpeg;base64,' + data.bytes);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
      setStatus('WebSocket connection closed');
      if (event.code !== 1000) {
        alert(`WebSocket closed unexpectedly: ${event.code} - ${event.reason}`);
      }
    };

    socketRef.current.onerror = (error) => {
      console.log('WebSocket error:', error);
      setStatus('WebSocket error');
    };
  };

  const startCapture = async () => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      alert('Please connect first.');
      return;
    }

    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = videoStream;
    videoStreamRef.current = videoStream;
    videoRef.current.play();

    const captureFrame = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const arrayBuffer = reader.result;
            socketRef.current.send(arrayBuffer);
          };
          reader.readAsArrayBuffer(blob);
        } else {
          console.error('Failed to capture image blob from canvas.');
        }
      }, 'image/jpeg');

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        requestAnimationFrame(captureFrame);
      }
    };

    videoRef.current.addEventListener('loadedmetadata', () => {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      captureFrame();
    });
  };

  const stopCapture = () => {
    if (videoStreamRef.current) {
      const tracks = videoStreamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    setStatus('Camera stopped');
  };

  return (
    <div className='capture-nav'>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className='capture-page'>
        <div className={` ${isNavbarOpen ? 'content-cover' : 'content-toggle'}`}>
          <div className='capture'>
            <div className="capture-video">
              <video ref={videoRef} />
            </div>
            <div className="capture-details">
              <div className="capture-input">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="status" id="status">{status}</div>
              <div className="capture-btn">
                <button className="connectWebSocket" onClick={connectWebSocket}>Connect</button>
                <button className="connectWebSocket" onClick={startCapture}>Start Capture</button>
              </div>
              <img
                id="processedImage"
                src={processedImageSrc}
                style={{ display: processedImageSrc ? 'block' : 'none' }}
                alt="Processed"
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>
          <div className='percentage-progress'>
            <div className='percentage-top'>
              <div className='small-percentage'>
                Progress Percentage
              </div>
              <div className='percentage-info'>
                <p className='completion'>
                  <span className='digits'>{progressPercentage}%</span> 
                  <span className='percentage-complete'>Complete</span>
                  <span className={`material-symbols-outlined ${progressPercentage === 100 ? 'percentage-progress-success' : 'percentage-progress-color'}`}>
                    check_circle
                  </span>
                </p>
              </div>
            </div>
            <div className='percentage-bar'>
              <span
                className='percentage-loader'
                style={{ width: `${progressPercentage}%` }} 
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Captureface;
