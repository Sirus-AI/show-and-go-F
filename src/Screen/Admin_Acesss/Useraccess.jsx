import React from 'react'
import { useState, useCallback, useEffect } from 'react'
import Navbar from '../../Component/Navigation/Navbar';
import server from '../../Server';
const Useraccess = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [userReq,setUserReq]=useState()
    const [userTypeDisplay, setUserTypeDisplay] = useState();
    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const fetchUserReq = useCallback(async () => {
        server.get(
            `api/org/access-request/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
              })
              .then((response) => {
                setUserReq(response.data)
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
            })
            .catch((error) => {
                console.log(error);
            });
    })
   const deleteUser=async(org_id)=>{
  
    try{
     await server.post(`api/org/access-request/${org_id}/delete/`)
    }catch(error){
        console.log(error);
    }   }
    const AcessUser=async(org_id)=>{
  
        try{
         await server.post(`api/org/access-request/${org_id}/toggle/`)
        }catch(error){
            console.log(error);
        }   }
    useEffect(() => {
        fetchUserReq()
       
    }, []);
  return (
    <div>
      <div className='home-page'>
                <Navbar toggleSidebar={toggleSidebar} />
                <div className='dashboard-content'>
                    <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                        <p className='overview'>User Request</p>
                        <div className='user_req'>
                            {userReq && userReq.inactive_organisations.map(org => (
                                <div className="userAcesscard" key={org.org_id}>
                                    <h5>  {org.users.f_name} {org.users.l_name}</h5>
                                    
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
                                            <button  onClick={AcessUser} >Active</button>
                                        </div>
                                        <div className='userAcess-delete-btn'>
                                            <button onClick={deleteUser}>Delete </button>
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

export default Useraccess
