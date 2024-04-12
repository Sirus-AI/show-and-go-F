import { useNavigate } from 'react-router-dom';
import './sidebar.css'
import Logo from '../../static_content/admin_content/Screenshot.png'
import { Link } from 'react-router-dom'
import server from '../../Server'
const Sidebar = () => {
    const navigate = useNavigate();
    const logoutHandler = () => {
        const userData = JSON.parse(localStorage.getItem("userData"))
       
        server
          .post(`api/users/logout/`,
          {
            refresh: userData.token.refresh
            
          },
          {
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
                            <Link to='/'> <li className='item'><i class="fa-solid fa-circle-half-stroke"></i><p>Dashboard</p></li></Link>
                            <Link to='/register_newuser'>  <li className='item'><i class="fa-solid fa-circle-half-stroke"></i><p>Register new user</p></li></Link>
                            <Link to='/Capture_face'><li className='item'><i class="fa-solid fa-camera-retro"></i><p>Capture face</p></li></Link>
                            <Link to='/Train'><li className='item'><i class="fa-solid fa-brain"></i><p>Train</p></li></Link>
                            <Link to='/Veiw_attendance_report'>       <li className='item'><i class="fa-solid fa-clipboard-user"></i><p>Veiw attendance report</p></li></Link>
                            <li className='item' onClick={logoutHandler}><i class="fa-solid fa-right-from-bracket"></i><p>Log out</p></li>
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
