import React, { useState, useEffect, useRef } from 'react';
import './Captureface.css';
import Navbar from '../../Component/Navigation/Navbar';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

const Captureface = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [email, setEmail] = useState('');
  const [externalCameraId, setExternalCameraId] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);
  const socketRef = useRef(null);
  const canvasRef = useRef(null);

  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };

    loadModels();
  }, []);

  useEffect(() => {
    socketRef.current = new WebSocket('ws://127.0.0.1:8000/ws/face_capture/');

    socketRef.current.onopen = () => {
      console.log('WebSocket is open now.');
    };

    socketRef.current.onmessage = (event) => {
      const image = new Image();
      image.src = URL.createObjectURL(event.data);
      const ctx = canvasRef.current.getContext('2d');
      image.onload = () => {
        ctx.drawImage(image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      };
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket is closed now.');
    };

    socketRef.current.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleTakePhoto = async () => {
    if (!showWebcam) {
      setShowWebcam(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      setWebcamStream(stream);
    } else {
      if (!webcamRef.current || !webcamRef.current.video) return;

      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(blob => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(blob);
        }
      }, 'image/jpeg');
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    // Send email to backend to initialize the session
    socketRef.current.send(JSON.stringify({ email: email }));
  };

  return (
    <div className='capture-nav'>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className='capture'>
        <div className="login-display">
          <div className='login-container'>
            <div className='profile'>
              <i className="fa-solid fa-camera-retro"></i>
            </div>
            <h1 className='h1'>Capture face</h1>
            <form className='form' onSubmit={handleSubmit}>
              <div className="credential">
                <div className='flex'>
                  <label htmlFor="email">Email</label>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="abcd@gmail.com"
                  className='input-email'
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className='webcam-container'>
                {showWebcam && (
                  <Webcam
                    ref={webcamRef}
                    className='webcam'
                    audio={false}
                    mirrored={true}
                    videoConstraints={{
                      width: 800,
                      height: 600,
                      facingMode: 'user',
                      deviceId: externalCameraId
                    }}
                  />
                )}
                <canvas ref={canvasRef} className='canvas' />
              </div>
              <button type="button" className='regis' onClick={handleTakePhoto}>
                {showWebcam ? 'Capture Photo' : 'Take Photo'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Captureface;
