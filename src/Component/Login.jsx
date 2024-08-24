import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { Link } from 'react-router-dom';
import server from '../Server';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [messageColor, setMessageColor] = useState('green');
  const navigate = useNavigate();
  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text')
      return;
    }
    setPasswordType('password')
  }
  const handleError = (e) => {
    setVisible(true);
    setMessage(e);
    setMessageColor('red')
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      handleError('Email and password are required.');
      return;
    } else {
      server.post(
        'api/users/login/',
        {
          email: email,
          password: password,
        }
      )
      .then((response) => {
        const userData = {
          token: response.data.token,
          user: response.data.user,
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        if (response.data.token.access) {
          // Assuming response.data.token.access contains the access token
          document.cookie = `token=${response.data.token.access}; path=/`;
          navigate('/Admindashboard', { replace: true });
        } else {
          console.log(response.data.msg);
          setVisible(true);
          setMessage(response.data.msg); // Assuming msg contains error message
          setMessageColor('red');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
        setVisible(true);
        setMessageColor('red');
        setMessage('An error occurred during login.'); // Set a generic error message
      });
    }
  };
  useEffect(() => {
   
    if (localStorage.getItem('userData')) {
      navigate('/Admindashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle id="LiveDemoExampleLabel">Alert</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p style={{ color: messageColor }}>{message}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <div className="login-dispplay">
        <div className='login-container'>
          <div className='profile'>
            <span className="material-symbols-outlined profile-logo">
              account_circle
            </span>
          </div>
          <h1 className='h1'>LOGIN</h1>
          <form className='form' onSubmit={handleLogin}>
            <div className="credential">
              <div className='flex'>
                <label htmlFor="phone">Email</label>
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="abcd@gmail.com"
                className='email'
                onChange={(e) => setEmail(e.target.value.trim())}
              />
            </div>
            <div className='credential'>
              <div className='flex'>
                <label htmlFor="password">Password</label>
              </div>
              <input
                type={passwordType}
                placeholder="Password"
                className='email'
                name="password"
                onChange={(e) => setPassword(e.target.value.trim())}
              />
            </div>
            <div className="show-password ">
              <div>
                <input
                  className=""
                  type="checkbox"
                  onClick={togglePassword}
                />
                Show Password
              </div>
            </div>
            <button className='regis' type="submit">LOGIN</button>
            <div className='account'>
              <p >Create the new user ?<Link to="/register_newuser"> Register</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
