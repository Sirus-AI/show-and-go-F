import React, { useState, useEffect } from 'react';
import { server } from '../../Server';
import Navbar from '../../Component/Navigation/Navbar';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react'; 
import './Train.css';

const Train = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [org_id, setOrg_id] = useState('');
  const [isTraining, setIsTraining] = useState(false); 
  const [message, setMessage] = useState(''); 
  const [showModal, setShowModal] = useState(false); 
  const [isSuccess, setIsSuccess] = useState(false); 

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
    setIsTraining(true); 
    setMessage(''); 

    server
      .post(`api/face_capture/train/${org_id}/`, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      })
      .then((response) => {
        setIsTraining(false); 
        setMessage('Training completed successfully!'); 
        setIsSuccess(true);
        setShowModal(true); 
      })
      .catch((error) => {
        setIsTraining(false); 
        setIsSuccess(false);
        if (error.response && error.response.data.error) {
          setMessage("Oops! There was an issue with the training. Please try again."); 
        } else {
          setMessage("Something went wrong. Please try again."); 
        }
        setShowModal(true);
      });
  };

  const handleClose = () => setShowModal(false); 

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
            <div className="spinner"></div>
            <p>Training is in progress. Please wait...</p>
          </div>
        )}

        {/* CoreUI Modal */}
        <CModal visible={showModal} onClose={handleClose}>
          <CModalHeader>
            <CModalTitle>Training Status</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <p style={{ color: isSuccess ? 'green' : 'red' }}>
              {message}
            </p>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleClose}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </div>
    </div>
  );
};

export default Train;
