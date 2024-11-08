import React from 'react'
import { useState,  useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar'
import {server} from '../../Server'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const Admindashboard = ({ registerUser, usertype, users }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [attendanceSummary, setAttendanceSummary] = useState({
    total_active_users: 0,
    total_inactive_users: 0,
    total_present_users: 0,
    total_absent_users: 0,
  });

  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  const userData = JSON.parse(localStorage.getItem("userData"))
  const user_type=userData.user_type
  const btnModal = () => {
    setVisible(true);
    setFormVisible(false);
  };

  const formModal = () => {
    setFormVisible(true);
    setVisible(false);
  };
  const fetchAttendanceSummary = async () => {
    try {
      const response = await server.get('/api/org/attendance-summary/', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      });
      setAttendanceSummary(response.data);
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
    }
  };
  const handleRegisteruser = async (e) => {
    e.preventDefault();
    if (!name || !about || !location) {
      setMessage('All fields are required');
      return;
    }
    try {
      await server.post('api/org/register-company/', {
        name,
        about,
        location,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      });
      setFormVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    btnModal();
    if(!user_type===1 || !user_type===2){
    fetchAttendanceSummary();
    }
  }, []);

   // Calculate percentages
   const totalUsers = attendanceSummary.total_active_users;
   const presentPercentage = totalUsers > 0 ? (attendanceSummary.total_present_users / totalUsers) * 100 : 0;
   const absentPercentage = totalUsers > 0 ? (attendanceSummary.total_absent_users / totalUsers) * 100 : 0;
 
   // Pie chart data
   const data = {
     labels: ['Present', 'Absent'],
     datasets: [
       {
         label: 'Attendance Summary',
         data: [attendanceSummary.total_present_users, attendanceSummary.total_absent_users],
         backgroundColor: ['#36A2EB', '#FF6384'],
         hoverBackgroundColor: ['#36A2EB', '#FF6384'],
       },
     ],
   };


  return (
    <div className="home-page">
      {(usertype === 1 || usertype === 2 || registerUser === true) ? null : (
        <CModal
          visible={visible}
          onClose={() => setVisible(false)}
          alignment="center"
        >
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Harry up</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="modalbody">
              <p className="modal-para">You are not registered in a company. Please register now.</p>
              <button className="modal-btn" onClick={formModal}>Register</button>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
          </CModalFooter>
        </CModal>
      )}
      <CModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        alignment="center"
      >
        <CModalHeader onClose={() => setFormVisible(false)}></CModalHeader>
        <CModalBody>
          <div className="register-display">
            <div className="modal-form">
              <h5>ORGANISATION REGISTRATION</h5>
              <form className="form" onSubmit={handleRegisteruser}>
                <div className="credential">
                  <div className="credential">
                    <div className="flex">
                      <label htmlFor="fname">Name</label>
                    </div>
                    <input
                      type="text"
                      name="fname"
                      id="fname"
                      placeholder="Name"
                      className="email"
                      onChange={(e) => setName(e.target.value.trim())}
                    />
                  </div>
                  <div className="credential">
                    <div className="flex">
                      <label htmlFor="lname">About</label>
                    </div>
                    <input
                      type="text"
                      name="About"
                      id="About"
                      placeholder="About"
                      className="about"
                      onChange={(e) => setAbout(e.target.value.trim())}
                    />
                  </div>
                </div>
                <div className="credential">
                  <div className="flex">
                    <label htmlFor="email">Location</label>
                  </div>
                  <input
                    type="text"
                    placeholder="location"
                    className="location"
                    onChange={(e) => setLocation(e.target.value.trim())}
                  />
                </div>
                <button className="regis" type="submit">Register</button>
              </form>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setFormVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="dashboard-content">
        <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
          <p className="overview">Overview</p>
          <div className="dashboard-card">
            <div className="card">
              <span className="material-symbols-outlined card-span">person</span>
              <div className="present">
                <p>Total</p>
                <p>{attendanceSummary.total_active_users}</p>
              </div>
            </div>
            <div className="card">
              <span className="material-symbols-outlined card-span">diversity_3</span>
              <div className="present">
                <p>Present</p>
                <p>{attendanceSummary.total_present_users} <span>{presentPercentage.toFixed(2)}%</span></p>
              </div>
            </div>
            <div className="card">
              <span className="material-symbols-outlined card-span">person_remove</span>
              <div className="present">
                <p>Absent</p>
                <p>{attendanceSummary.total_absent_users} <span>{absentPercentage.toFixed(2)}%</span></p>
              </div>
            </div>
            <div className="card">
              <span className="material-symbols-outlined card-span">person_add</span>
              <div className="present">
                <p>New User</p>
                <p>{attendanceSummary.total_inactive_users}</p>
              </div>
            </div>
          </div>

          {/* New Cards */}
          <div className="new-cards">
          <div className="new-card" style={{padding:'5px'}}>
              <Pie data={data} />
            </div>
            <div className="new-card camera-card">
              <h3>Attendance Controls</h3>
              <div className="camera-controls">
              <span class="material-symbols-outlined">
                video_call
              </span>
              <span class="material-symbols-outlined">
                tune
              </span>
              </div>
              <div className="camera-buttons">
                <button className='on-off' >Start in</button>
                <button className='on-off'>stop in</button>
                <button className='on-off' >Start out</button>
                <button className='on-off'>stop out</button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;
