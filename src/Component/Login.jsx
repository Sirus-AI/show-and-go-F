import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { Link } from 'react-router-dom';
import {server} from '../Server';
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
  
        if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          if (errors.email) {
            setMessage(errors.email[0]);  
          } else if (errors.password) {
            setMessage(errors.password[0]);  
          } else if (errors.non_field_errors) {
            setMessage(errors.non_field_errors[0]);  
          } else {
            setMessage('An error occurred during login.');  
          }
        } else {
          setMessage('An error occurred during login.');
        }
      });
    }
  };
  useEffect(() => {
   
    if (localStorage.getItem('f')) {
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
          <div className='login-brand'>
            <img src='/assets/logo-mark-ink.png' alt='' width='36' height='36' />
            <span className='login-brand-name'>SirusAI <span className='sirus-ams'>AMS</span></span>
          </div>
          <h1 className='h1 login-headline'>One photo. <em>Whole class</em> marked.</h1>
          <p className='login-sub'>Sign in to take attendance, review faces and export reports.</p>
          <form className='form' onSubmit={handleLogin}>
            <div className="credential">
              <div className='flex'>
                <label htmlFor="email">Email</label>
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
                id="password"
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
            <button className='regis' type="submit">Log in</button>
            <div className='account'>
              <p >Create the new user ?<Link to="/register_newuser"> Register</Link></p>
            </div>
          </form>
        </div>
        <aside className='login-visual' aria-hidden='true'>
          <div className='feed'>
            <span className='feed-label'>CAM_01</span>
            <div className='face f1'><span className='box'><i>STU_0117</i></span></div>
            <div className='face f2'><span className='box'><i>STU_0042</i></span></div>
            <div className='face f3'><span className='box'><i>STU_0089</i></span></div>
            <div className='face f4'><span className='box box-review'><i>review</i></span></div>
            <div className='face f5'><span className='box'><i>STU_0023</i></span></div>
            <div className='face f6'><span className='box'><i>STU_0156</i></span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Login;
