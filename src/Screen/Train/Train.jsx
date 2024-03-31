import React from 'react'
import './Train.css'
import Navbar from '../../Component/Navigation/Navbar'
import { useState } from 'react'
const Train = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className='train-nav'>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className='train'>
        <h1>work in progress.....</h1>
      </div>
    </div>
  )
}

export default Train
