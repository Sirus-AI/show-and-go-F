import React from 'react'
import Admindashboard from './Screen/Admin_dashboard/Admindashboard'
import Captureface from './Screen/Capture_face/Captureface'
import Train from './Screen/Train/Train'
import Veiwattendance from './Screen/Veiw_attendace/Veiwattendance'

import Login from './Component/Login'
import Newregis from './Component/Newregis'
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
          <Route path='/Admindashboard' element={<Admindashboard/>}/>
      
        </Routes>
      </Router>
    </div>
  )
}

export default Allroutes
