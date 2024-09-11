import React, { useState, useEffect } from 'react';
import './AttendanceData.css';
import Navbar from '../Navigation/Navbar';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';

const UserAttendance = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [date, SetDate] = useState();
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState('green');
    const [attendanceData, setAttendanceData] = useState(null);
    const [Useroption, setUseroption] = useState([]);
    const [selectedUserID, setSelectedUserId] = useState();
    const [summaryAttendanceData, setSummaryAttendanceData] = useState(null);
    const [user, setUser] = useState({});
    const [userType, setUserType] = useState('');
    const [userId, setUserId] = useState('');

    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const handleError = (e, color = 'red') => {
        setVisible(true);
        setMessage(e);
        setMessageColor(color);
    };

    const fecthUserList = () => {
    
            server.get(`api/org/alluser-list/`, {
                header: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {
                setUseroption(response.data);  
            })
            .catch((error) => {
                console.log(error);
            });
        
    };

    const Handledate = async (e) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0];
        
        if (!date) {
            handleError('Date is required.');
        } else if (new Date(date) > new Date(currentDate)) {
            handleError('Dates should not be greater than the current date.');
        } else {
            try {
                const params = {
                    date: date,
                    user_id: userType === 'Orgadmin' ? selectedUserID : userId,
                };

                const response = await server.get('/attendance/singleUser-attendance-report/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': '{{ csrf_token }}',
                    },
                    params,
                });
                setAttendanceData(response.data);

                const response2 = await server.get('/attendance/attendance-report/daily/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': '{{ csrf_token }}',
                    },
                    params,
                });
                setSummaryAttendanceData(response2.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    handleError(error.response.data.message || 'Data not found.', 'orange');
                } else {
                    handleError('An error occurred while fetching the data.');
                }
            }
        }
    };

    const handleUserSelection = (e) => {
        setSelectedUserId(e.target.value);
    };

    useEffect(() => {
        if (userType === 'Orgadmin') {
            fecthUserList();
        }
    
        // Retrieve and parse 'userData' from localStorage
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            
            
            if (parsedUserData && parsedUserData.user) {
                setUser(parsedUserData);  
                setUserType(parsedUserData.user.user_type);
                setUserId(parsedUserData.user.id);
            }
        }
    }, [userType]);

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

            <div className='user-AttendanceData'>
                <div className='attendance-heading'>Daily Report</div>
                <div className='cover-user-Attendance'>
                    <form className='date-form' onSubmit={Handledate}>
                        <div className='input-date'>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                className='date-input'
                                onChange={(e) => SetDate(e.target.value.trim())}
                            />
                        </div>
                        {userType === 'Orgadmin' && (
                            <div className="select-user">
                                <select 
                                    name="user" 
                                    id="selctuser"
                                    value={selectedUserID}
                                    onChange={handleUserSelection} 
                                >
                                    <option value="" disabled>Select a user</option>
                                    {Useroption.length > 0 ? (
                                        Useroption.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.f_name} {user.l_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No users available</option>
                                    )}
                                </select>
                            </div>
                        )}

                        <div className='input-date-button'>
                            <button className='show-go-btn' type="submit">Select</button>
                        </div>
                    </form>

                    <div className='attendance-table-cover'>
                        {attendanceData && attendanceData.length > 0 ? (
                            <table className='attendance-table'>
                                <thead className='attendance-thead'>
                                    <tr>
                                        <td>User Name</td>
                                        <td>In Time</td>
                                        <td>Out Time</td>
                                        <td>Break Duration</td>
                                        <td>Working Duration</td>
                                    </tr>
                                </thead>
                                <tbody className='attendance-tbody'>
                                    {attendanceData.map((record) => (
                                        <tr key={record.id}>
                                            <td>{record.user_name}</td>
                                            <td>{new Date(record.in_timestamp).toLocaleTimeString()}</td>
                                            <td>{new Date(record.out_timestamp).toLocaleTimeString()}</td>
                                            <td>{record.break_duration}</td>
                                            <td>{record.work_duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available for the selected date.</p>
                        )}
                    </div>

                    <div className='attendance-table-cover'>
                        {summaryAttendanceData ? (
                            <table className='attendance-table'>
                                <thead className='attendance-thead'>
                                    <tr>
                                        <td>First In</td>
                                        <td>Last Out</td>
                                        <td>Total Work Duration</td>
                                        <td>Total Break Duration</td>
                                    </tr>
                                </thead>
                                <tbody className='attendance-tbody'>
                                    <tr>
                                        <td>{summaryAttendanceData.first_in}</td>
                                        <td>{summaryAttendanceData.last_out}</td>
                                        <td>{summaryAttendanceData.total_work_duration}</td>
                                        <td>{summaryAttendanceData.total_break_duration}</td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p>No summary data available for the selected date.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAttendance;
