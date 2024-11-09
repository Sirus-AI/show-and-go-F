import React from 'react'
import { useState,  useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar'
const Super_Admindasboard = ({ registerUser, usertype, users }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);



  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className="home-page">
    
     
    <Navbar toggleSidebar={toggleSidebar} />
    <div className="dashboard-content">
      <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
        <p className="overview">Super Admin/User Dasboard</p>
        <div className="dashboard-card">
          
        </div>
      </div>
    </div>
  </div>
);
};

export default Super_Admindasboard
