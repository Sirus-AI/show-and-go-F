import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import {server} from '../../Server'
import Sidebar from './Sidebar'
import { Menu } from 'lucide-react'

const Navbar = ({ toggleSidebar }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [username , setUsername] = (useState(''))
    const [profile ,setProfile] = (useState());
    const [userorganization, setUserorganization] = useState([]);
    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
        toggleSidebar();
    };
    const [usertype, setUsertype] = useState()
    let userData = JSON.parse(localStorage.getItem('userData'))
    const fetchUser = useCallback(async () => {
        server
            .get(`api/users/user/profile/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {
                setProfile(response.data);
                 setUsername(response.data.f_name +" "+response.data.l_name)
                setUsertype(response.data.user_type)
                userData.user_type = response.data.user_type;
                localStorage.setItem('userData', JSON.stringify(userData));
            })
            .catch((error) => {
                console.log(error);
            });
    })
    const fecthUserOrganisation = async () => {
        server
            .get('api/org/user-organisation/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {
                setUserorganization(response.data)
                userData.org_id = response.data.org_id;
                localStorage.setItem('userData', JSON.stringify(userData));
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        fetchUser()
        fecthUserOrganisation();

    }, []);
    return (
        <div className='shiv'> 
            <div className={showSidebar ? 'side-off' : 'side-bar-nav '}>
                <Sidebar  usertype={usertype} profile={profile}/>
            </div>
            <div className='nav-bar'>

                <div className={showSidebar ? 'navigation-toggle ' : 'navigation '}>

                    <div className='nav-cover'>
                        <div className='heading'>
                            <button type='button' className='bar' onClick={handleToggleSidebar} aria-label='Toggle menu'>
                                <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
                            </button>
                            <div className='name'>
                                {usertype === 1 ? (
                                    <div className='admin'>Super Admin <em>Dashboard</em></div>
                                ) : usertype === 2 ? (
                                    <div className='admin'>Admin <em>Dashboard</em></div>
                                ) : usertype === 3 ? (
                                    <div className='admin'>Organization Admin <em>Dashboard</em></div>
                                ) : usertype === 4 ? (
                                    <div className='admin'>User <em>Dashboard</em></div>
                                ) : (<div className='admin'>Loading....</div>)}
                                <p className='shiv'><span className='shiv-report'>Overall Report of institution, welcome back !!..</span> <span className='username'>{username}</span></p>
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
