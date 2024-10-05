import React, { useState } from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import { Link } from 'react-router-dom';
import { server } from '../Server';
import { useNavigate } from 'react-router-dom';

const Newregis = () => {
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const [userType, setUserType] = useState();
  const [fieldErrors, setFieldErrors] = useState({}); 

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));

  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };

  const handleError = (e) => {
    setVisible(true);
    setMessage(e);
    setMessageColor('red');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validate = () => {
      if (!fname || !lname || !email || !phone || !password || !cpassword || !userType) {
        handleError('All fields are required');
        return false;
      }
      if (phone.length !== 10) {
        handleError('Phone number must be 10 digits.');
        return false;
      }
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!passwordPattern.test(password)) {
        handleError('Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character.');
        return false;
      }
      if (password !== cpassword) {
        handleError('Passwords do not match.');
        return false;
      }
      return true;
    };

    if (validate()) {
      server.post(
        'api/users/register/', {
          f_name: fname,
          l_name: lname,
          password: password,
          email: email.trim(),
          phone: phone,
          password2: cpassword,
          user_type: userType
        }
      )
      .then((response) => {
        if (response.status === 201) {
          setMessageColor('green');
          setMessage(response.data.msg);
          setVisible(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          setMessageColor('red');
          setMessage(response.data.message || 'An error occurred.');
          setVisible(true);
        }
      })
      .catch((error) => {
        const responseError = error.response && error.response.data;
        if (responseError) {
          if (responseError.email) {
            // Handling field-specific error for email
            setFieldErrors({ email: responseError.email[0] });
          } else if (responseError.phone) {
            // Example: Handle field-specific error for phone
            setFieldErrors({ phone: responseError.phone[0] });
          } else {
            handleError(responseError.error || 'Registration failed. Please try again.');
          }
        } else {
          handleError('Something went wrong. Please try again.');
        }
      });
    }
  };

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
      <div className="register-display">
        <div className='register-container'>
          <div className='profile'>
            <span className="material-symbols-outlined profile-logo">
              account_circle
            </span>
          </div>
          <h1 className='h1'>REGISTRATION</h1>
          <form className='form' onSubmit={handleSubmit}>
            <div className='credential'>
              <div className='user-name'>
                <div className=''>
                  <div className='flex'>
                    <label htmlFor="fname">First Name</label>
                  </div>
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    placeholder="First Name"
                    className='email'
                    onChange={(e) => setFname(e.target.value.trim())}
                  />
                </div>
                <div className='left-name'>
                  <div className='flex'>
                    <label htmlFor="lname">Last Name</label>
                  </div>
                  <input
                    type="text"
                    name="lname"
                    id="lname"
                    placeholder="Last Name"
                    className='email'
                    onChange={(e) => setLname(e.target.value.trim())}
                  />
                </div>
              </div>
            </div>
            <div className='credential'>
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
              {fieldErrors.email && <p style={{ color: 'red' }}>{fieldErrors.email}</p>}  {/* Email Error */}
            </div>
            <div className='credential'>
              <div className='flex'>
                <label htmlFor="phone">Phone number</label>
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone no*"
                className='email'
                onChange={(e) => setPhone(e.target.value.trim())}
              />
              {fieldErrors.phone && <p style={{ color: 'red' }}>{fieldErrors.phone}</p>}  {/* Phone Error */}
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
            <div className='credential'>
              <div className='flex'>
                <label htmlFor="cpassword">Confirm Password</label>
              </div>
              <input
                type={passwordType}
                placeholder="Confirm Password"
                name="cpassword"
                className='email'
                onChange={(e) => setCpassword(e.target.value.trim())}
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
            <div className='radio'>
              Create account as :
              <div className='user-input'>
                <input type="radio" name='userType' value="3" onChange={(e) => setUserType(e.target.value)} /> Admin
              </div>
              <div className='user-input'>
                <input type="radio" name='userType' value="4" onChange={(e) => setUserType(e.target.value)} /> User
              </div>
            </div>
            <button className='regis' type="submit">Register</button>
            {userData ? (
              <div className='account'>
                <p>Go to DashBoard ? <Link to="/Admindashboard">DashBoard</Link></p>
              </div>
            ) : (
              <div className='account'>
                <p>Already have an account ? <Link to="/">Login</Link></p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newregis;
