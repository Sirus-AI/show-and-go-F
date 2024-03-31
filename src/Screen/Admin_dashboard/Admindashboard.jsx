import React from 'react'
import './Admindashboard.css'
import Navbar from '../../Component/Navigation/Navbar'
import { useState } from 'react'
import Admin from '../../static_content/admin_content/Screenshot.png'
const Admindashboard = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    return (
        <div className='home-page'>
            <Navbar toggleSidebar={toggleSidebar} />
            <div className='dashboard-content'>
                <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                    <p className='overview'>Overview</p>
                    <div className='dashboard-card'>

                        <div className='card'>
                            <span class="material-symbols-outlined card-span">
                                person
                            </span>
                            <div className='present'>
                                <p>Total</p>

                            </div>
                        </div>
                        <div className='card'>
                            <span class="material-symbols-outlined card-span">
                                diversity_3
                            </span>
                            <div className='present'>
                                <p>Present</p>
                                <p>375 <span>65%</span></p>
                            </div>
                        </div>
                        <div className='card'>
                            <span class="material-symbols-outlined card-span">
                                person_remove
                            </span>
                            <div className='present'>
                                <p>Absent</p>
                                <p>375 <span>65%</span></p>
                            </div>
                        </div>
                        <div className='card'>
                            <span class="material-symbols-outlined card-span">
                                person_add
                            </span>
                            <div className='present'>
                                <p>Total</p>
                                <p>375 <span>65%</span></p>
                            </div>
                        </div>
                    </div>
                    <div className='user'>
                    <div className='user-info'>
                        <img src={Admin} alt='image' />
                        <div className='info'>
                            Note that the development build is not optimized.
                        </div>
                        </div>
                    </div>
                </div>
            </div></div>
    )
}

export default Admindashboard
