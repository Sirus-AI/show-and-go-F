import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import '../css/';

const Register_img = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [username, setUsername] = useState('');

  const startWebcamCapture = () => {
    setIsCapturing(true);
  };

  const stopWebcamCapture = () => {
    setIsCapturing(false);
  };

  const captureAndSendFrame = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImages((prevImages) => [...prevImages, imageSrc]);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your form submission logic here, including sending capturedImages and username to the server
    console.log('Username:', username);
    console.log('Captured Images:', capturedImages);
  };

  return (
    <div>
      <input type="checkbox" name="" id="menu-toggle" />
      <div className="overlay">
        <label htmlFor="menu-toggle"></label>
      </div>

      <div className="sidebar">
        {/* Your sidebar content */}
      </div>

      <div className="main-content">
        <header>
          {/* Your header content */}
        </header>

        <div className="container">
          <div className="form-group">
            <h1>Capture Face</h1>
          </div>

          <form id="captureForm" onSubmit={handleSubmit}>
            <div className="input">
              <i className="fa-solid fa-user"></i>
              <label htmlFor="username">Username:</label>
            </div>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />

            <div className="form-group">
              <button
                className="btn btn-outline-info"
                type="button"
                onClick={startWebcamCapture}
              >
                Start Capture
              </button>
              <button
                className="btn btn-outline-info"
                type="button"
                onClick={stopWebcamCapture}
              >
                Stop Capture
              </button>
            </div>

            <Webcam
              audio={false}
              height={200}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: 'user',
              }}
              className={isCapturing ? 'webcam-active' : ''}
            />

            <div className="form-group">
              <button className="btn btn-outline-info" type="button" onClick={captureAndSendFrame}>
                Capture Image
              </button>
            </div>

            <div className="form-group">
              {capturedImages.map((image, index) => (
                <img key={index} src={image} alt={`Captured ${index + 1}`} />
              ))}
            </div>

            <button className="btn btn-main btn-block" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register_img;
