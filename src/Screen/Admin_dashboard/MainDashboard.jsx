import React from 'react'
import Admindashboard from './Admindashboard'
import Userdashboard from './Userdashboard'
import { useState, useCallback, useEffect } from 'react'
import server from '../../Server'

const MainDashboard = () => {
    const [usertype,setUsertype]=useState()
    const fetchUser = useCallback(async () => {
        server
            .get(`api/users/user/profile/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {
               
                setUsertype(response.data.user_type)
            })
            .catch((error) => {
                console.log(error);
            });
    })
    useEffect(() => {
        fetchUser()
       
    }, []);
  return (
    <div>
       {(usertype === 1 || usertype === 2)? (
        <Admindashboard/>
       ): (
        <Userdashboard/>
       )}
    </div>
  )
}

export default MainDashboard
