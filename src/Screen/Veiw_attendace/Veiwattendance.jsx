import React from 'react'
import './Veiwattendance.css'
import Navbar from '../../Component/Navigation/Navbar'
import { useState } from 'react'
const Veiwattendance = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className='attendance-nav'>
       <Navbar toggleSidebar={toggleSidebar} />
      <div className='attendance'>
           <h1>work in progress.....</h1> 
        </div>
    </div>
  )
}

export default Veiwattendance
