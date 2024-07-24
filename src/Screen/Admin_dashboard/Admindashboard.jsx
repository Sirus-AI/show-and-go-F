import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar'
import server from '../../Server'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import Admin from '../../static_content/admin_content/Screenshot.png'
const Admindashboard = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [location, setLocation] = useState('');
    const [organisations, setOrganisations] = useState([]);
    const [users, setUsers] = useState([]);
    const [registeruser, setRegisterUsers] = useState();
    const [usertype,setUsertype]=useState()
   

    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };
    const btnModal = () => {
        setVisible(true)
        setFormVisible(false)
    }
    const formModal = () => {
        setFormVisible(true)
        setVisible(false)
    }
    const fetchUserRegister = useCallback(async () => {
        server
            .get(`api/users/user/profile/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {
                setRegisterUsers(response.data.organisation_status.has_organisation);
                setUsers(response.data);
                setUsertype(response.data.user_type)
            })
            .catch((error) => {
                console.log(error);
            });
    })
   
    const handleRegisteruser = async (e) => {
        e.preventDefault();
            if (!name || !about || !location) {
                setMessage('All fields are required');
                return ;
            }
         else {
            try {
                
                await server.post(
                    'api/org/register-company/',
                    {
                        name: name,
                        about: about,
                        location: location,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': '{{ csrf_token }}',
                        },
                      } )
                      setFormVisible(false)
            } catch (error) {
                console.log(error);
            }
        }
    };
 
    useEffect(() => {
        btnModal()
        fetchUserRegister()
       
    }, []);
    return (
        <div>
            {(usertype === 1 || usertype === 2) || registeruser===true ? null: (
            <CModal
                visible={visible}
                onClose={() => setVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
                alignment="center"
            >
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle id="LiveDemoExampleLabel" >Harry up</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='modalbody'>
                        <p className='modal-para'>you are not register in company please register now</p>
                        <button className='modal-btn' onClick={() => formModal()}>Register</button>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            )}
            <CModal
                visible={formVisible}
                onClose={() => setFormVisible(false)}
                aria-labelledby="LiveDemoExampleLabel"
                alignment="center"
            >
                <CModalHeader onClose={() => setFormVisible(false)}>
                    {/* <CModalTitle id="LiveDemoExampleLabel" >Harry up</CModalTitle> */}
                </CModalHeader>
                <CModalBody>
                    <div className="register-display">
                        <div className='modal-form'>
                            <h5 >ORGANISATION REGISTRATION</h5>
                            <form className='form' onSubmit={handleRegisteruser}>
                                <div className='credential'>

                                    <div className='credential'>
                                        <div className='flex'>
                                            <label htmlFor="fname">Name</label>
                                        </div>
                                        <input
                                            type="text"
                                            name="fname"
                                            id="fname"
                                            placeholder="Name"
                                            className='email'
                                            onChange={(e) => setName(e.target.value.trim())}
                                        />
                                    </div>

                                    <div className='credential'>
                                        <div className='flex'>
                                            <label htmlFor="lname">About</label>
                                        </div>
                                        <input
                                            type="text"
                                            name="About"
                                            id="About"
                                            placeholder="About"
                                            className='about'
                                            onChange={(e) => setAbout(e.target.value.trim())}
                                        />
                                    </div>
                                </div>
                                <div className='credential'>
                                    <div className='flex'>
                                        <label htmlFor="email">Location</label>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="location"
                                        className='location'
                                        onChange={(e) => setLocation(e.target.value.trim())}
                                    />
                                </div>

                                <button className='regis' type="submit">Register</button>
                            </form>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setFormVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <div className='home-page'>
                <Navbar toggleSidebar={toggleSidebar} />
                <div className='dashboard-content'>
                    <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                        <p className='overview'>Overview</p>
                        <div className='dashboard-card'>

                            <div className='card'>
                                <span class="material-symbols-outlined card-span">
                                  person
                                </span>
                                <div className='present'>
                                    <p>Total</p>

                                </div>
                            </div>
                            <div className='card'>
                                <span class="material-symbols-outlined card-span">
                                    diversity_3
                                </span>
                                <div className='present'>
                                    <p>Present</p>
                                    <p>375 <span>65%</span></p>
                                </div>
                            </div>
                            <div className='card'>
                                <span class="material-symbols-outlined card-span">
                                    person_remove
                                </span>
                                <div className='present'>
                                    <p>Absent</p>
                                    <p>375 <span>65%</span></p>
                                </div>
                            </div>
                            <div className='card'>
                                <span class="material-symbols-outlined card-span">
                                    person_add
                                </span>
                                <div className='present'>
                                    <p>Total</p>
                                    <p>375 <span>65%</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></div></div>
    )
}

export default Admindashboard
