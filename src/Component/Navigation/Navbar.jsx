import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import {server} from '../../Server'
import Sidebar from './Sidebar'

const Navbar = ({ toggleSidebar }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [username , setUsername] = (useState(''))

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
        toggleSidebar();
    };
    const [usertype, setUsertype] = useState()
    const fetchUser = useCallback(async () => {
        server
            .get(`api/users/user/profile/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {
                 setUsername(response.data.f_name +" "+response.data.l_name)
                setUsertype(response.data.user_type)
                localStorage.setItem('user_type', JSON.stringify(response.data.user_type));
            })
            .catch((error) => {
                console.log(error);
            });
    })
    useEffect(() => {
        fetchUser()


    }, []);
    return (
        <div className='shiv'> 
            <div className={showSidebar ? 'side-off' : 'side-bar-nav '}>
                <Sidebar  usertype={usertype} />
            </div>
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
                                {usertype === 1 ? (
                                    <span className='admin'>Super Admin Dashboard</span>
                                ) : usertype === 2 ? (
                                    <span className='admin'>Admin Dashboard</span>
                                ) : usertype === 3 ? (
                                    <span className='admin'>Organization Admin Dashboard</span>
                                ) : usertype === 4 ? (
                                    <span className='admin'>User Dashboard</span>
                                ) : (<span className='admin'>Loading....</span>)}
                                <p className='shiv'><b>Overall Report of institution, welcome back !!..<span>{username}</span></b></p>
                            </div>

                        </div>
                        <div className='show-btn'>
                            <button className='show-go-btn'>Show and Go</button>
                        </div>
                    </div>

                </div>

                {/* <div className={showSidebar ? 'side-off' : 'side-bar-nav '}>
                <Sidebar  usertype={usertype} />
            </div> */}

            </div>
        </div>
    )
}

export default Navbar
