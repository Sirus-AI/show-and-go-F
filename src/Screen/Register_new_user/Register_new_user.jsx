import React from 'react'
import './Register_new_user.css'
import Navbar from '../../Component/Navigation/Navbar'
import { useState } from 'react'
const Register_new_user = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const toggleSidebar = () => {
      setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className='register-nav'>
         <Navbar toggleSidebar={toggleSidebar} />
        <div className='register'>
           <h1>work in progress.....</h1> 
        </div>
      
    </div>
  )
}

export default Register_new_user
