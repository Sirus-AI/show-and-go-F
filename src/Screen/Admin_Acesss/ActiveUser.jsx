import React from 'react'
import { useState,useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar';
import {server} from '../../Server';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
const ActiveUser = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [userReq, setUserReq] = useState()
    const [visible, setVisible] = useState(false);
    const [organizationReq, setOrganizationReq] = useState()
    const [selectUser, setSelectUser] = useState()
    const [selectOrgnization, setSelectOrgnization] = useState()
    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };
    const userTypeDisplay = JSON.parse(localStorage.getItem("user_type"))
    
    const fecthUserList = () => {

        server.get(`api/org/list-organisations/`, {
            header: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
            },
        })
            .then((response) => {
                setOrganizationReq(response.data)

            })
            .catch((error) => {
                console.log(error);
            });
    }
    const fecthOrganzationList = () => {

        server.get(`api/org/alluser-list/`, {
            header: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
            },
        })
            .then((response) => {
                setUserReq(response.data)

            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        fecthUserList()
        fecthOrganzationList()
    }, [])
    console.log(userReq)
    const getorgid = (orgId) => {
        setSelectOrgnization(orgId)
        setVisible(true)
    }
    const getUser = (User) => {
        setSelectUser(User)
        setVisible(true)
    }
    if (userTypeDisplay === 3) {
        return (
            <div>
                <CModal
                    visible={visible}
                    onClose={() => setVisible(false)}
                    aria-labelledby="LiveDemoExampleLabel"
                    alignment="center"
                >
                    <CModalHeader onClose={() => setVisible(false)}>
                        <CModalTitle id="LiveDemoExampleLabel" >User Details</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <div className='modalbody'>
                            {selectUser ? (
                                <div className='profile-details'>
                                    <div className='org-name'>
                                        <p>Name: {selectUser.f_name} {selectUser.l_name}</p>
                                    </div>
                                    <div className='org-namee mob'>
                                        <p>Email: {selectUser.email}</p>
                                    </div>
                                    <div className='org-name username'>
                                        <p>Phone: {selectUser.phone}</p>
                                    </div>
                                    {/* <div className='org-name username'>
                                        <p>Status: {selectUser.users.is_active === true ? (<span> Active</span>) : (<span> Active</span>)}</p>
                                    </div> */}
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                    </CModalFooter>
                </CModal>
                <div>
                    <div className='home-page'>
                        <Navbar toggleSidebar={toggleSidebar} />
                        <div className='dashboard-content'>
                            <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                                <p className='overview'>Active User</p>
                                {userReq && userReq.map(org => (
                                    <div className='Active-user' onClick={() => getUser(org)}>
                                        <div className="active-user-cover">
                                            <h6>  {org.f_name} {org.l_name}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <CModal
                    visible={visible}
                    onClose={() => setVisible(false)}
                    aria-labelledby="LiveDemoExampleLabel"
                    alignment="center"
                >
                    <CModalHeader onClose={() => setVisible(false)}>
                        <CModalTitle id="LiveDemoExampleLabel" >Organization Details</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <div className='modalbody'>
                            {selectOrgnization ? (
                                <div className='profile-details'>
                                    <div className='org-name'>
                                        <p>Name: {selectOrgnization.users.f_name} {selectOrgnization.users.l_name}</p>
                                    </div>
                                    <div className='org-namee mob'>
                                        <p>Email: {selectOrgnization.users.email}</p>
                                    </div>
                                    <div className='org-name username'>
                                        <p>Phone: {selectOrgnization.users.phone}</p>
                                    </div>
                                    <div className='org-name username'>
                                        <p>About: {selectOrgnization.about}</p>
                                    </div>
                                    <div className='org-name username'>
                                        <p>Location: {selectOrgnization.location}</p>
                                    </div>
                                    <div className='org-name username'>
                                        <p>Status: {selectOrgnization.users.is_active === true ? (<span> Active</span>) : (<span> Active</span>)}</p>
                                    </div>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Close
                        </CButton>
                    </CModalFooter>
                </CModal>
                <div>
                    <div className='home-page'>
                        <Navbar toggleSidebar={toggleSidebar} />
                        <div className='dashboard-content'>
                            <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                                <p className='overview'>Active Organization</p>
                                {organizationReq && organizationReq.map(org => (
                                    <div className='Active-user' onClick={() => getorgid(org)}>
                                        <div className={`active-user-cover ${org.users.is_active ? 'inactive' : 'active'}`}>
                                            <h6>  {org.users.f_name} {org.users.l_name}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ActiveUser
