import React from 'react'
import { useState, useCallback, useEffect ,useRef} from 'react'
import Navbar from '../../Component/Navigation/Navbar'
import { server } from '../../Server'
import NameChamge from '../../Component/Setting/NameChamge'

import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';

const Profile = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [profile, setProfile] = useState();
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');
    const [userTypeDisplay, setUserTypeDisplay] = useState();
    const [userorganization, setUserorganization] = useState([]);
    const [profileNameChange, setProfileNameChange] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };
    const handleError = (e) => {
        setVisible(true);
        setMessage(e);
        setMessageColor('red');
    };
    const dropdownRef = useRef(null);
    const fetchInfo = useCallback(async () => {
        server
            .get('api/users/user/profile/', {
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
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const deleteProfileImage = async () => {
        try {
            await server.post(`/api/users/delete-photo/`)
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }
    const openEditNameModal = () => {
        setProfileNameChange(true);

    }
    const handleProfileClick = () => {

        if (profile.profile_photo != null) {
            setIsDropdownOpen(true);
        } else {
            const fileInput = document.getElementById("file-input");
            if (fileInput) {
                fileInput.click();
            }
        }
    };

    const UpdateProfilePic = () => {
            const fileInput = document.getElementById("fileUpdate-input");
            if (fileInput) {
                fileInput.click();
            }
            
            //  setIsDropdownOpen(false);
    }
   
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profile_photo', file);
            server.post('/api/users/add-photo/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then((response) => {
                    window.location.reload();
                })
                .catch((error) => {
                    handleError(error.response?.data?.error || 'An error occurred.');
                });
        }
    };
    useEffect(() => {
        fetchInfo();
        

    }, []);
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);
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
            <div className='profile-nav'>
                <Navbar toggleSidebar={toggleSidebar} />
                <div className='profile-page'>
                    <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                        <div className='profile-page-cover '>
                            <div className='profile-active'>
                                <div className='profile-avtar'>

                                    <div className="profilr-image" >
                                        <span class="material-symbols-outlined edit-propfile-pic" onClick={handleProfileClick}>
                                            edit
                                        </span>
                                        {profile && profile.profile_photo != null ? (
                                            <img src={profile.profile_photo} />) : (<span class="material-symbols-outlined avtar">
                                                person
                                            </span>)}
                                    </div>
                                    {isDropdownOpen ? (
                                        <div className="profile-dropdown-menu"  ref={dropdownRef}>
                                            <div className='profile-dropdown-btn' onClick={deleteProfileImage}>Remove Photo</div>
                                            <div className='profile-dropdown-btn' onClick={UpdateProfilePic}>Update Photo</div>
                                            <input
                                                type="file"
                                                id="fileUpdate-input"
                                                onChange={handleFileChange}
                                                style={{ display: "none" }}
                                            />
                                        </div>
                                    ) : (
                                        <div className='setting-input-email'>
                                            <input
                                                type="file"
                                                id="file-input"
                                                onChange={handleFileChange}
                                                style={{ display: "none" }}
                                            />
                                           
                                        </div>
                                    )}
                                </div>

                                <div className='prof prof-name'>
                                    <p className='title'>Name  :</p>{profile != null ? (
                                        <p className='profile-edit-name'>  {profile.f_name} {' '}
                                            {profile.l_name}<span class="material-symbols-outlined edit-name" onClick={openEditNameModal}>
                                                edit
                                            </span></p>) : (<p>Your Name</p>)}
                                </div>

                            </div>
                            <div className='profile-details'>


                                <div className='prof prof-email'>
                                    <p className='title'>Email : </p>{profile != null ? (
                                        <p className='value'>{profile.email}</p>) : (<p className='value'>example@gmail.com</p>)}
                                </div>
                                <div className='prof prof-mobile'>
                                    <p className='title'>Phone :</p>
                                    {profile != null ? (
                                        <p className='value'>{profile.phone}</p>) : (<p className='value'>00000000000</p>)}
                                </div>
                                <div className='prof prof-usertype'>
                                    <p className='title'>User Type :</p>
                                    {profile != null ? (
                                        <p className='value'>{userTypeDisplay}</p>) : (<p>User Type </p>)}
                                </div>
                                {(userTypeDisplay === 'Organization Admin' || userTypeDisplay === 'Organization User') ? (<div className='prof organisation'>
                                    <p className='title'>organisation-name :</p>
                                    {userorganization ? (
                                        <p className='value'>{userorganization.name}</p>
                                    ) : (
                                        <p className='value'>xyz-name</p>
                                    )}
                                </div>) : null}
                                {/*  <div className='prof-name orgnozation' >
                                        <p>Name :</p>
                                        {profile != null ? (
                                        <p>shubham</p>):( <p>Your Name</p>)}
                                    </div>
                                     <div className='prof-name user-post'>
                                        <p>Name :</p>
                                        {profile != null ? (
                                        <p>shubham</p>):( <p>Your Name</p>)}
                                    </div>
                                    <div className='prof-name'>
                                        <p>Name :</p>
                                        {profile != null ? (
                                        <p>shubham</p>):( <p>Your Name</p>)}
                                    </div> */}
                            </div>


                        </div>
                    </div>
                </div>
                <NameChamge isOpen={profileNameChange} onClose={() => setProfileNameChange(false)} />

            </div>

        </div >
    )
}

export default Profile;
