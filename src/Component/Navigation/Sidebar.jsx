import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserRound, UserPlus, ScanFace, BrainCircuit, FileText, Inbox, Users, ScanLine, Settings, CircleHelp, LifeBuoy, LogOut } from 'lucide-react';
import {server} from '../../Server';
import { useState } from 'react';
import SettingModal from '../Setting/SettingModal';
const Sidebar = ({ usertype ,profile }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingModalOpen,setSettingModalOpen]=useState(false);
  

  const logoutHandler = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    server
      .post(`api/users/logout/`, {
        refresh: userData.token.refresh
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      })
      .then(async (response) => {
        if (response.status === 205) {
          localStorage.removeItem('userData');
          navigate('/', { replace: true });
        } else {
          console.log('Something went wrong!', response);
          localStorage.removeItem('userData');
        }
      })
      .catch(async (error) => {
        localStorage.removeItem('userData');
        navigate('/', { replace: true });
      });
  };

  return (
  
      <div className={`side-bar ${sidebarOpen ? 'side-bar-open' : ''}`}>
        <div className='side-bar-cover'>
          <div className='logo'>
            <img className='cng-logo' src='/assets/logo-mark-cream.png' alt='' width='32' height='32' />
            <div className='sirus-logo'>SirusAI <span className='sirus-ams'>AMS</span></div>
          </div>
          <div className='admin-logo'>
            {profile && profile.profile_photo != null ? (
                                            <img src={profile.profile_photo} alt='' />) : (<span className="avtar">
                                                <UserRound size={20} strokeWidth={1.75} aria-hidden="true" />
                                            </span>)}
            <div className='logo-admin'>
              {profile&& profile.f_name != null?(
                 <div className="name"> <p>{profile.f_name.charAt(0).toUpperCase() + profile.f_name.slice(1).toLowerCase()}</p>
                 <p>{profile.l_name.charAt(0).toUpperCase() + profile.l_name.slice(1).toLowerCase()}</p>
                  </div>
              ) :
              (
                <p>Name</p>
              )}
            </div>
          </div>
          <nav className='list' aria-label='Main'>
            <ul className='ul-list'>
              <NavLink to='/Admindashboard' className="link-color"> <li className='item'><span><LayoutDashboard size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Dashboard</p></li></NavLink>
              <NavLink to='/Profile' className="link-color"> <li className='item'><span><UserRound size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Profile</p></li></NavLink>
              {(usertype===4|| usertype===1)?null:<NavLink to='/register_newuser' className="link-color"> <li className='item'><span><UserPlus size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Register new user</p></li></NavLink>}
              {(usertype===4|| usertype===1)?null:<NavLink to='/Capture_face' className="link-color"><li className='item'><span><ScanFace size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Capture face</p></li></NavLink>}
              {(usertype===3)?(<NavLink to='/Train' className="link-color"><li className='item'><span><BrainCircuit size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Train</p></li></NavLink>):null}
              {(usertype===1)? null:<NavLink to='/Veiw_attendance_report' className="link-color"> <li className='item'><span><FileText size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>View attendance report</p></li></NavLink>}
              {(usertype === 1 || usertype === 2 || usertype === 3) ?
                (<NavLink to='/useraccess' className="link-color"> <li className='item'><span><Inbox size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>User Request</p></li></NavLink>)
                 : null}
             {(usertype === 1 || usertype === 2 || usertype === 3) ?
                (<NavLink to='/ActiveUser' className="link-color">       <li className='item'><span><Users size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Active User</p></li></NavLink>)
                : null}
              {(usertype === 3)?(<NavLink to='/Mark-in' className="link-color"> <li className='item'><span><ScanLine size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Mark in</p></li></NavLink>):null}
              
            </ul>
          </nav>
          <div className='big-logo'>
            <button type='button' className='item' onClick={() => setSettingModalOpen(true)} ><span><Settings size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Settings</p></button>
            <li className='item'><span><CircleHelp size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>FAQ'S</p></li>
            <li className='item'><span><LifeBuoy size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>HELP</p></li>
            <button type='button' className='item' onClick={logoutHandler}><span><LogOut size={20} strokeWidth={1.75} aria-hidden="true" /></span><p>Log out</p></button>
          </div>
          <SettingModal isOpen={settingModalOpen} onClose={() => setSettingModalOpen(false)} />
        </div>
      </div>
    
  
  );
}

export default Sidebar;
