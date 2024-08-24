import React, { useState, useCallback, useEffect } from 'react';
import Admindashboard from './Admindashboard';
import Userdashboard from './Userdashboard';
import {server} from '../../Server';

const MainDashboard = () => {
    const [usertype, setUsertype] = useState();
    const [users, setUsers] = useState([]);
    const [registeruser, setRegisterUsers] = useState();
    const fetchUser = useCallback(async () => {
        try {
            const response = await server.get('api/users/user/profile/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            });
            setRegisterUsers(response.data.organisation_status.has_organisation);
            setUsers(response.data);
            setUsertype(response.data.user_type)
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    return (
        <div>
            {usertype === 3 ? (
                <Admindashboard registerUser={registeruser} usertype={usertype} users={users}/>
            ) : usertype === 4 ? (
                <Userdashboard registerUser={registeruser} usertype={usertype} users={users}/>
            ) : (
                <Admindashboard registerUser={registeruser} usertype={usertype} users={users}/>
            )}
        </div>
    );
}

export default MainDashboard;
