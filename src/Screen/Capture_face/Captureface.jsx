import React from 'react'
import { useState } from 'react'
import Navbar from '../../Component/Navigation/Navbar'
const Captureface = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className='capture-nav'>
       <Navbar toggleSidebar={toggleSidebar} />
      <div className='capture'>
           <h1>work in progress.....</h1> 
        </div>
    </div>
  )
}

export default Captureface
