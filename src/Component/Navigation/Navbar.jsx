import React from 'react'

import Sidebar from './Sidebar'
import { useState } from 'react'

const Navbar = ({ toggleSidebar }) => {
    const [showSidebar, setShowSidebar] = useState(false);

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
        toggleSidebar(); 
    };
    return (
        <div className='nav-bar'>

            <div className='navigation'>

                <div className='nav-cover'>
                    <div className='heading'>
                        <span className='bar' onClick={handleToggleSidebar}>
                            <span class="material-symbols-outlined">
                                menu
                            </span>
                        </span>
                        <div className='name'>
                            <span className='admin'>
                                Admin Dashboard
                            </span>
                            <p>Overall Report of institution</p>
                        </div>

                    </div>
                    <div className='show-btn'>
                        <button className='show-go-btn'>Show and Go</button>
                    </div>
                </div>

            </div>

            <div className={showSidebar ? 'side-off' : 'side-bar-nav '}>
                <Sidebar />
            </div>

        </div>
    )
}

export default Navbar
