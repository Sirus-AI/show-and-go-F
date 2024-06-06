import React from 'react'

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
       <div className='dashboard-content'>
       <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>

      <div className='attendance'>
      <span class="material-symbols-outlined  open" >
double_arrow
</span>
           <h2 className='frnt'>View attendance Report</h2> 
           
        </div> 
        <p className='line'>Admin can check attendance report of all users</p>
      
        <h3 className='srch'>Search by</h3>
        <div className="by">
        <button className='emp'>By Employee</button>
        <button className='emp'>By Date</button>
        </div>
        <h2 className='today'>Today's Statistics</h2>
        <div className='rect'>
           <div className='rect2'>
            <p className='totl'>Total Number of Employee</p>
             <h3 className='twenty'>20</h3>
           </div>
           <div className='rect3'>
            <p className='totl'>Employee Present Today</p>
            <h3 className='twenty'>0</h3>
           </div>
           
        </div>
         </div></div>
       
    </div>
  )
}

export default Veiwattendance
