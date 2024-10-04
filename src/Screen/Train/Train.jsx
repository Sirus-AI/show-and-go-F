import React, { useState, useEffect } from 'react';
import { server } from '../../Server';
import Navbar from '../../Component/Navigation/Navbar';
import './Train.css'; 

const Train = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [org_id, setOrg_id] = useState('');
  const [isTraining, setIsTraining] = useState(false); // To manage loading animation
  const [message, setMessage] = useState(''); // To manage response messages

  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const fetchUserOrganisation = async () => {
    server
      .get(`api/org/user-organisation/`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      })
      .then((response) => {
        setOrg_id(response.data.org_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchUserOrganisation();
  }, []);

  const startTraining = () => {
    setIsTraining(true); // Set training to true to show animation
    setMessage(''); // Reset message

    server.post(`api/face_capture/train/${org_id}/`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': '{{ csrf_token }}',
      },
    })
      .then((response) => {
        setIsTraining(false); // Stop the loader
        setMessage(response.data.message); // Set the success message
      })
      .catch((error) => {
        setIsTraining(false); // Stop the loader
        if (error.response && error.response.data.error) {
          setMessage(error.response.data.error); // Set the error message
        } else {
          setMessage("Something went wrong. Please try again."); // Generic error message
        }
      });
  };

  return (
    <div className='train-nav'>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className='train'>
        <div className="train-button">
          <button onClick={startTraining} disabled={isTraining}>
            {isTraining ? 'Training...' : 'Start Train'}
          </button>
        </div>
        {isTraining && (
          <div className="loader">
            {/* Loader animation */}
            <div className="spinner"></div>
            <p>Training is in progress. Please wait...</p>
          </div>
        )}
        {message && (
          <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Train;
