import React from 'react'
import Navbar from './Component/Navigation/Navbar'
import Admindashboard from './Screen/Admin_dashboard/Admindashboard'
import Captureface from './Screen/Capture_face/Captureface'
import Register_new_user from './Screen/Register_new_user/Register_new_user'
import Train from './Screen/Train/Train'
import Userdashboard from './Screen/User_dashboard/Userdashboard'
import Veiwattendance from './Screen/Veiw_attendace/Veiwattendance'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const Allroutes = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<Admindashboard/>}/>
          <Route path='/register_newuser'  element={<Register_new_user/>}/>
          <Route path='/Capture_face' element={<Captureface/>}/>
          <Route path='/Train' element={<Train/>}/>
          <Route path='/Veiw_attendance_report' element={<Veiwattendance/>}/>
          <Route path='/' element={<Admindashboard/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default Allroutes
