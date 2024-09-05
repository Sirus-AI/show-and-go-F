import React, { useState, useCallback, useEffect } from 'react';
import Navbar from '../../Component/Navigation/Navbar';
import { server } from '../../Server';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';

const Profile = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('green');
  const [userTypeDisplay, setUserTypeDisplay] = useState('');
  const [userorganization, setUserorganization] = useState({});

  const toggleSidebar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleError = (e) => {
    setVisible(true);
    setMessage(e);
    setMessageColor('red');
  };

  const fetchInfo = useCallback(async () => {
    try {
      const response = await server.get('api/users/user/profile/', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      });
      setProfile(response.data);
      switch (response.data.user_type) {
        case 1:
          setUserTypeDisplay('Super Admin');
          break;
        case 2:
          setUserTypeDisplay('Super user');
          break;
        case 3:
          setUserTypeDisplay('Organization Admin');
          break;
        default:
          setUserTypeDisplay('Organization User');
      }
      fetchUserOrganisation();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchUserOrganisation = async () => {
    try {
      const response = await server.get('api/org/user-organisation/', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': '{{ csrf_token }}',
        },
      });
      setUserorganization(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  return (
    <div>
      <CModal visible={visible} onClose={() => setVisible(false)} aria-labelledby="LiveDemoExampleLabel">
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
      <div className='profile-nav'>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className='profile-page'>
          <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
            <div className='profile-page-cover'>
              <div className='profile-active'>
                <div className='profile-avatar'>
                  <div className='profile-image'>
                    {profile?.profile_photo ? (
                      <img src={profile.profile_photo} alt="Profile" />
                    ) : (
                      <span className="material-symbols-outlined avtar">person</span>
                    )}
                  </div>
                </div>
                <div className='prof prof-name'>
                  <p className='title'>Name:</p>
                  <p>{profile ? `${profile.f_name} ${profile.l_name}` : 'Your Name'}</p>
                </div>
              </div>
              <div className='profile-details'>
                <div className='prof prof-email'>
                  <p className='title'>Email:</p>
                  <p className='value'>{profile?.email || 'example@gmail.com'}</p>
                </div>
                <div className='prof prof-mobile'>
                  <p className='title'>Phone:</p>
                  <p className='value'>{profile?.phone || '0000000000'}</p>
                </div>
                <div className='prof prof-usertype'>
                  <p className='title'>User Type:</p>
                  <p className='value'>{userTypeDisplay || 'User Type'}</p>
                </div>
                {(userTypeDisplay === 'Organization Admin' || userTypeDisplay === 'Organization User') && (
                  <div className='prof organisation'>
                    <p className='title'>Organization Name:</p>
                    <p className='value'>{userorganization.name || 'xyz-name'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
