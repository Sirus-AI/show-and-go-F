import React, { useEffect, useState } from 'react';

import Navbar from '../../Component/Navigation/Navbar';
import OrgAdminAttendance from '../../Component/Attendance_showData/OrgAdminAttendance';
import OrgAdminFromToAttendance from '../../Component/Attendance_showData/OrgAdminFromToAttendance';
import UserAttendance from '../../Component/Attendance_showData/UserAttendance';
import UserFromToAttendance from '../../Component/Attendance_showData/UserFromToAttendance';

const Veiwattendance = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [attendanceType, setAttendanceType] = useState('all-users');
  const [datetype, setDateType] = useState("single-day-report");
  const [userType, setUserType] = useState('');

  useEffect(() => { 
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const { user } = JSON.parse(storedUserData);
      setUserType(user.user_type);
      
      if (user.user_type === 'orgusers') {
        setAttendanceType('single-user'); 
      }
    }
  }, []);
  
 

  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleAttendanceTypeChange = (event) => {
    setAttendanceType(event.target.value);
  };

  const handelDateTypeChange = (event) => {
    setDateType(event.target.value);
  };

  return (
    <div className='attendance-nav'>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className='dashboard-content'>
        <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
          <div className='attendance'>
            <h1>Attendance Report</h1>

            {/* Conditionally render select element based on userType */}
            {userType !== 'orgusers' && (
              <div className="select-attendance-type">
                <label htmlFor="Get Report by">Get Report for</label>
                <select 
                  name="attendance-type" 
                  id="attendance-type" 
                  value={attendanceType} 
                  onChange={handleAttendanceTypeChange}>
                  <option value="all-users">All Users</option>
                  <option value="single-user">Single User</option>
                </select>
              </div>
            )}

            <div className="date-type">
              <label htmlFor="date-type">View Dates</label>
              <select 
                name="date-type" 
                id="date-type" 
                value={datetype} 
                onChange={handelDateTypeChange}>
                <option value="single-day-report">Single Day</option>
                <option value="custom-dates-reports">Custom Dates</option>
              </select>
            </div>

            {/* Conditional Rendering based on selected options */}
            {attendanceType === 'all-users' && datetype === 'single-day-report' && <OrgAdminAttendance />}
            {attendanceType === 'all-users' && datetype === 'custom-dates-reports' && <OrgAdminFromToAttendance />}
            {attendanceType === 'single-user' && datetype === 'single-day-report' && <UserAttendance />}
            {attendanceType === 'single-user' && datetype === 'custom-dates-reports' && <UserFromToAttendance />}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Veiwattendance;
