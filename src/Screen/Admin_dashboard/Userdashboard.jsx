import React from 'react'
import { useState, useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar'
import {server} from '../../Server'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
const Userdashboard = ({ registerUser, usertype, users }) => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);

    const [org_id, setOrg_id] = useState('');
    const [listorganization, setListorganization] = useState([]);



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

    const fecthListOrganisation = async () => {
        server
            .get(`api/org/list-organisations/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {

                setListorganization(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }
    console.log(org_id)
    const handleRegisteruser = async (e) => {
        e.preventDefault();
        if (!org_id) {
            setMessage('All fields are required');
            return;
        }
        else {
            try {

                await server.post(
                    'api/org/register-user-org/',
                    {

                        org_id: org_id,
                        users: users.id,
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': '{{ csrf_token }}',
                    },
                })
                setFormVisible(false)
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        btnModal()
        fecthListOrganisation();

    }, []);

    return (
        <div>
            {(usertype === 1 || usertype === 2) || registerUser === true ? null : (
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
                                    <div className='flex'>
                                        <label htmlFor="organizationName">Organization Name</label>
                                    </div>
                                    <select
                                        id="organizationName"
                                        value={org_id}
                                        onChange={(e) => setOrg_id(e.target.value)}
                                        className='select-org'
                                        placeholder='Select Organization'
                                    >
                                        <option value="">Select Organization</option>
                                        {listorganization.map(organization => (
                                            <option key={organization.org_id} value={organization.org_id}>
                                                {organization.name}
                                            </option>
                                        ))}
                                    </select>
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

export default Userdashboard
