import React from 'react'
import Navbar from '../../Component/Navigation/Navbar'
import { useState } from 'react'
const Userdashboard = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div>
       <div className='userdashboard'>
           <h1>work in progress.....</h1> 
        </div>
    </div>
  )
}

export default Userdashboard
