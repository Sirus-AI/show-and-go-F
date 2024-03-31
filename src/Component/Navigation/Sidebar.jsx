import React from 'react'
import './sidebar.css'
import Logo from '../../static_content/admin_content/Screenshot.png'
import { Link } from 'react-router-dom'
const Sidebar = () => {
    return (
        <div>
            <div className='side-bar'>
                <div className='side-bar-cover'>
                    <div className='logo'>
                        <i class="fa-brands fa-staylinked cng-logo"></i>
                        <div className='sirus-logo'>
                        SHOW AND GO</div>
                    </div>
                    <div className='admin-logo'>
                        <img src={Logo} alt="" />

                        <div className='logo-admin'>
                            <p>Admin</p>
                            <p>Designation</p>
                        </div>
                    </div>
                    <div className='list'>
                        <ul className='ul-list'>
                           <Link to ='/'> <li className='item'><i class="fa-solid fa-circle-half-stroke"></i><p>Dashboard</p></li></Link>
                          <Link to ='/register_newuser'>  <li className='item'><i class="fa-solid fa-circle-half-stroke"></i><p>Register new user</p></li></Link>
                            <Link to ='/Capture_face'><li className='item'><i class="fa-solid fa-camera-retro"></i><p>Capture face</p></li></Link>
                            <Link to ='/Train'><li className='item'><i class="fa-solid fa-brain"></i><p>Train</p></li></Link>
                     <Link to ='/Veiw_attendance_report'>       <li className='item'><i class="fa-solid fa-clipboard-user"></i><p>Veiw attendance report</p></li></Link>
                     <Link to ='/'>       <li className='item'><i class="fa-solid fa-right-from-bracket"></i><p>Log out</p></li></Link>
                        </ul>
                    </div>
                    <div className='big-logo'>
                        <div className='camera'>
                    <i class="fa-solid fa-camera-retro"></i>
                    <h5>Start Camera</h5>
                    <p>Run the cameras one after one</p>
                    </div>
                    <div className='camera-btn'>
                        <button className='start-btn'>Start Camera-in</button>
                        <button className='start-btn'>Start Camera-out</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
