import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar'
import {server} from '../../Server'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';

const Profile = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [profile, setProfile] = useState();
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');
    const [userTypeDisplay, setUserTypeDisplay] = useState();
    const [userorganization, setUserorganization] = useState([]);

    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const handleError = (e) => {
        setVisible(true);
        setMessage(e);
        setMessageColor('red');
    };

    const fetchInfo = useCallback(async () => {
        server
            .get(`api/users/user/profile/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {
                setProfile(response.data);
                if (response.data.user_type === 1) {
                    setUserTypeDisplay('Super Admin')
                }
                else if (response.data.user_type === 2) {
                    setUserTypeDisplay('Super user')
                }
                else if (response.data.user_type === 3) {
                    setUserTypeDisplay('Organization Admin')
                }
                else {
                    setUserTypeDisplay('Organization User')
                }
                fecthUserOrganisation();
            })
            .catch((error) => {
                console.log(error);
            });
    });

    const fecthUserOrganisation = async () => {
        server
            .get(`api/org/user-organisation/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {
                setUserorganization(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <div className="profile-page">
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
            <Navbar toggleSidebar={toggleSidebar} />
            <div className={isNavbarOpen ? 'profile-toggle' : 'profile-content'}>
                <div className="profile-page-cover">
                    <div className="profile-active">
                        <div className="profile">
                            {profile && profile.profile_photo ? (
                                <img src={profile.profile_photo} alt="Profile" />
                            ) : (
                                <span className="material-symbols-outlined profile-logo">account_circle</span>
                            )}
                        </div>
                        <div className="profile-details">
                            <div className="prof-name">
                                <p>Name:</p>
                                {profile ? (
                                    <p>{profile.f_name} {profile.m_name} {profile.l_name}</p>
                                ) : (
                                    <p>Your Name</p>
                                )}
                            </div>
                            <div className="prof-name">
                                <p>Email:</p>
                                {profile ? <p>{profile.email}</p> : <p>example@gmail.com</p>}
                            </div>
                            <div className="prof-name">
                                <p>Phone:</p>
                                {profile ? <p>{profile.phone}</p> : <p>0000000000</p>}
                            </div>
                            <div className="prof-name">
                                <p>User Type:</p>
                                {profile ? <p>{userTypeDisplay}</p> : <p>user email</p>}
                            </div>
                            {(userTypeDisplay === 'Organization Admin' || userTypeDisplay === 'Organization User') && (
                                <div className="prof-name">
                                    <p>Organization Name:</p>
                                    {userorganization ? <p>{userorganization.name}</p> : <p>xyz-name</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
