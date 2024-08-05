import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar';
import server from '../../Server';

const OrguserAccess = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [userReq,setUserReq]=useState()
    const [userTypeDisplay, setUserTypeDisplay] = useState();
    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

  return (
    <div>
    <div className='home-page'>
              <Navbar toggleSidebar={toggleSidebar} />
              <div className='dashboard-content'>
                  <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                      <p className='overview'>User Request</p>
                      
                  </div>
              </div>
              </div>
  </div>
  )
}

export default OrguserAccess
