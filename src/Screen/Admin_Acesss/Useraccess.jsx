import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar';
import server from '../../Server';
const Useraccess = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [userReq, setUserReq] = useState()
    const [organizationReq, setOrganizationReq] = useState()
    
    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };
    const userTypeDisplay = JSON.parse(localStorage.getItem("user_type"))
    
    const fetchOrgniztionReq = useCallback(async () => {
        server.get(
            `api/org/access-request/`, {
            headers: {
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
    })
    const deleteOrgniztionReq = async (org_id) => {

        try {
            await server.post(`api/org/access-request/${org_id}/delete/`)
        } catch (error) {
            console.log(error);
        }
    }
    const AcessOrgniztionReq = async (org_id) => {

        try {
            await server.post(`api/org/access-request/${org_id}/toggle/`)
        } catch (error) {
            console.log(error);
        }
    }
    const fetchUserReq = useCallback(async () => {
        server.get(
            `api/org/access-request/user-org/`, {
            headers: {
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
    })
    const deleteUserReq = async (user_id) => {

        try {
            await server.post(`api/org/access-request/user-org/${user_id}/delete/`)
        } catch (error) {
            console.log(error);
        }
    }
    const AcessUserReq = async (user_id) => {

        try {
            await server.post(`api/org/access-request/user-org/${user_id}/toggle/`)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchOrgniztionReq()
        fetchUserReq()
        
    }, []);
     
  
    if (userTypeDisplay === 3) {
        return (
            <div>
                <div className='home-page'>
                    <Navbar toggleSidebar={toggleSidebar} />
                    <div className='dashboard-content'>
                        <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                            <p className='overview'>User Request</p>
                            <div className='user_req'>
                                {userReq && userReq.inactive_users.map(org => (
                                    <div className="userAcesscard" key={org.id}>
                                        <h5>  {org.user.f_name} {org.user.l_name}</h5>
                                        <div className="userAcess-details">
                                            <p><strong>User Name:</strong> {userTypeDisplay}</p>
                                            <p><strong>Email:</strong> {org.user.email}</p>
                                            <p><strong>Phone:</strong> {org.user.phone}</p>
                                            <p><strong>Status :</strong> inactive</p>
                                        </div>
                                        <div className='userAcess-func'>
                                            <div className='userAcess-toggle-btn'>
                                            <button onClick={()=>AcessUserReq(org.user.id)} >Active</button>
                                            </div>
                                            <div className='userAcess-delete-btn'>
                                            <button onClick={()=>deleteUserReq(org.user.id)}>Delete </button>
                                            </div>
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
                <div className='home-page'>
                    <Navbar toggleSidebar={toggleSidebar} />
                    <div className='dashboard-content'>
                        <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                            <p className='overview'>Organization Request</p>
                            <div className='user_req'>
                                {organizationReq && organizationReq.inactive_organisations.map(org => (
                                    <div className="userAcesscard" key={org.org_id}>
                                        <h5>  {org.users.f_name} {org.users.l_name}</h5>
                                        <h5>  {org.org_id}</h5>
                                        <div className="userAcess-details">
                                            <p><strong>About:</strong> {org.about}</p>
                                            <p><strong>Location:</strong> {org.location}</p>
                                            <p><strong>User Name:</strong> {userTypeDisplay}</p>
                                            <p><strong>Email:</strong> {org.users.email}</p>
                                            <p><strong>Phone:</strong> {org.users.phone}</p>
                                            <p><strong>Status :</strong> inactive</p>
                                        </div>
                                        <div className='userAcess-func'>
                                            <div className='userAcess-toggle-btn'>
                                            <button onClick={()=>AcessOrgniztionReq(org.org_id)} >Active</button>
                                            </div>
                                            <div className='userAcess-delete-btn'>
                                            <button onClick={()=>deleteOrgniztionReq(org.org_id)}>Delete </button>
                                            </div>
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

export default Useraccess
