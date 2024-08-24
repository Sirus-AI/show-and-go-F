import React, { useState, useRef } from 'react';
import './Captureface.css';
import Navbar from '../../Component/Navigation/Navbar';
import { WEBSOCKET_URL } from '../../Server';

const Captureface = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [processedImageSrc, setProcessedImageSrc] = useState('');
  const socketRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
        console.log('Received message:', data);

        if (data.status) {
          setStatus(data.status);
          if (data.status === 'collection_complete') {
            alert('Face data collection complete.');
          }
        } else if (data.error) {
          setStatus(data.error);
        } else if (data.bytes) {
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
    videoRef.current.play();

    const captureFrame = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          socketRef.current.send(arrayBuffer);
        };
        reader.readAsArrayBuffer(blob);
      });
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

  return (
    <div className='capture-nav'>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className='capture'>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
        />
        <button onClick={connectWebSocket}>Connect</button>
        <button onClick={startCapture}>Start Capture</button>
        <div id="status">{status}</div>
        <img 
          id="processedImage" 
          src={processedImageSrc} 
          style={{ display: processedImageSrc ? 'block' : 'none' }} 
          alt="Processed" 
        />
        <video ref={videoRef} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default Captureface;
