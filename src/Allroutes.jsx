import React from 'react'
import MainDashboard from './Screen/Admin_dashboard/MainDashboard'
import Captureface from './Screen/Capture_face/Captureface'
import Train from './Screen/Train/Train'
import Veiwattendance from './Screen/Veiw_attendace/Veiwattendance'
import Profile from './Screen/Profile/Profile'
import Useraccess from './Screen/Admin_Acesss/Useraccess'
import Login from './Component/Login'
import Newregis from './Component/Newregis'
import Attendance from './Screen/Mark_Attendance/Attendance'
import ActiveUser from './Screen/Admin_Acesss/ActiveUser'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const Allroutes = () => {
  return (
    <div>
      <Router>
        <Routes>
          
          <Route path='/' element={<Login />}/>
          <Route path='/register_newuser'  element={<Newregis/>}/>
          <Route path='/Capture_face' element={<Captureface/>}/>
          <Route path='/Train' element={<Train/>}/>
          <Route path='/Veiw_attendance_report' element={<Veiwattendance/>}/>
          <Route path='/Admindashboard' element={<MainDashboard/>}/>
          <Route path='/Profile' element={<Profile/>}/>
          <Route path='/useraccess'  element={<Useraccess/>}/>
          <Route path='/ActiveUser' element = {<ActiveUser/>}/>
          <Route path='/Mark-in' element = {<Attendance/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default Allroutes
