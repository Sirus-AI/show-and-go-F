import React, { useState, useCallback, useEffect } from 'react';
import Admindashboard from './Admindashboard';
import Userdashboard from './Userdashboard';
import server from '../../Server';

const MainDashboard = () => {
    const [usertype, setUsertype] = useState();

    const fetchUser = useCallback(async () => {
        try {
            const response = await server.get('api/users/user/profile/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            });
            setUsertype(response.data.user_type);
        } catch (error) {
            console.log(error);
        }
    }, []); // Ensure an empty dependency array to avoid creating a new function on each render

    useEffect(() => {
        fetchUser();
    }, [fetchUser]); // Add fetchUser as a dependency to useEffect

    return (
        <div>
            {usertype === 3 ? (
                <Admindashboard />
            ) : usertype === 4 ? (
                <Userdashboard />
            ) : (
                <Admindashboard />
            )}
        </div>
    );
}

export default MainDashboard;
