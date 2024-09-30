import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
            <i className="fa-brands fa-staylinked cng-logo"></i>
            <div className='sirus-logo'>SHOW AND GO</div>
          </div>
          <div className='admin-logo'>
            {profile && profile.profile_photo != null ? (
                                            <img src={profile.profile_photo} />) : (<span class="material-symbols-outlined avtar">
                                                person
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
          <div className='list'>
            <ul className='ul-list'>
              <Link to='/Admindashboard' className="link-color"> <li className='item'><span>🏠 </span><p>Dashboard</p></li></Link>
              <Link to='/Profile' className="link-color"> <li className='item'><span>📄 </span><p>Profile</p></li></Link>
              <Link to='/register_newuser' className="link-color"> <li className='item'><span>📝</span><p>Register new user</p></li></Link>
              <Link to='/Capture_face' className="link-color"><li className='item'><span>📸 </span><p>Capture face</p></li></Link>
              {(usertype==3)?(<Link to='/Train' className="link-color"><li className='item'><span>📚 </span><p>Train</p></li></Link>):null}
              <Link to='/Veiw_attendance_report' className="link-color"> <li className='item'><span>📝 </span><p>View attendance report</p></li></Link>
              {(usertype === 1 || usertype === 2 || usertype === 3) ?
                (<Link to='/useraccess' className="link-color"> <li className='item'><span>❓ </span><p>User Request</p></li></Link>)
                 : null}
             {(usertype === 1 || usertype === 2 || usertype === 3) ?
                (<Link to='/ActiveUser' className="link-color">       <li className='item'><i class="fa-solid fa-clipboard-user"></i><p>Active User</p></li></Link>)
                : null}
              {(usertype === 3)?(<Link to='/Mark-in' className="link-color"> <li className='item'><i className="fa-solid fa-circle-half-stroke"></i><p>Mark in</p></li></Link>):null}
              
            </ul>
          </div>
          <div className='big-logo'>
            <li className='item' onClick={() => setSettingModalOpen(true)} ><span>⚙️</span><p>Settings</p></li>
            <li className='item'><span>❓</span><p>FAQ'S</p></li>
            <li className='item'><span>🔧</span><p>HELP</p></li>
            <li className='item' onClick={logoutHandler}><i className="fa-solid fa-right-from-bracket"></i><p>Log out</p></li>
          </div>
          <SettingModal isOpen={settingModalOpen} onClose={() => setSettingModalOpen(false)} />
        </div>
      </div>
    
  
  );
}

export default Sidebar;
