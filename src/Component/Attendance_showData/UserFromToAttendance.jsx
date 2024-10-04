import React, { useState, useEffect,useCallback } from 'react';
import './AttendanceData.css';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
import Loader from '../Loader/Loader';

const UserFromToAttendance = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
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
    const [loading, setLoading] = useState(false); // New loading state

    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const handleError = (e, color = 'red') => {
        setVisible(true);
        setMessage(e);
        setMessageColor(color);
        setLoading(false);
    };

    const fecthUserList = async () => {
           setLoading(true);
          try {
              const response = await server.get('api/org/alluser-list/', {
                  headers: {
                      'Content-Type': 'application/json',
                      'X-CSRFToken': '{{ csrf_token }}',
                  },
              });
              setUseroption(response.data);
              setLoading(false)
          } catch (error) {
              console.log(error);
              handleError('Failed to fetch user list.');
          }
      
  };


    const Handledate = async (e) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0];

        if (!fromDate || !toDate) {
            handleError('Both "From Date" and "To Date" are required.');
        } else if (new Date(fromDate) > new Date(currentDate) || new Date(toDate) > new Date(currentDate)) {
            handleError('Dates should not be greater than the current date.');
        } else if (new Date(toDate) < new Date(fromDate)) {
            handleError('"To Date" cannot be earlier than "From Date".');
        } else {
            setLoading(true); // Show loader when fetching data
            try {
                const params = {
                    from_date: fromDate,
                    to_date: toDate,
                    user_id: userType === 'Orgadmin' ? selectedUserID : userId,
                };

                const response = await server.get('/attendance/dateRange-userAttendancereport/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': '{{ csrf_token }}',
                    },
                    params,
                });
                setAttendanceData(response.data);
                setLoading(false); // Hide loader after fetching data
            } catch (error) {
                setLoading(false); // Hide loader on error
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

    const groupDataByDate = () => {
        return attendanceData.reduce((acc, item) => {
            const date = item.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
    };

    const groupedData = attendanceData ? groupDataByDate() : {};

    useEffect(() => { 
if (userType === 'Orgadmin') {
          fecthUserList();
      }
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
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Alert</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p style={{ color: messageColor }}>{message}</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                </CModalFooter>
            </CModal>

            {/* Show loader while data is being fetched */}
            {loading ? (
                <Loader />
            ) : (
                <div>
                    <div className='attendance-heading'>Custom Date Report</div>
                    <div className='cover-user-Attendance'>
                        <form className='date-form' onSubmit={Handledate}>
                            <div className='input-date'>
                                <input
                                    type="date"
                                    className='date-input'
                                    onChange={(e) => setFromDate(e.target.value.trim())}
                                />
                                <input
                                    type="date"
                                    className='date-input'
                                    onChange={(e) => setToDate(e.target.value.trim())}
                                />
                            </div>
                        
                            {userType === 'Orgadmin' && (
                                <div className="select-user">
                                    <select 
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
                            {attendanceData && Object.keys(groupedData).map((date, index) => (
                                <div key={index} className="attendance-date-group">
                                    <h2 className='date-wise'>Date: {date}</h2>
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
                                            {groupedData[date].map((record, idx) => {
                                                const inTime = new Date(record.in_timestamp).toLocaleTimeString();
                                                const outTime = record.out_timestamp ? new Date(record.out_timestamp).toLocaleTimeString() : 'N/A';
                                                const breakTime = record.break_duration.split('.')[0];
                                                return (
                                                    <tr key={idx}>
                                                        <td>{record.user_name}</td>
                                                        <td>{inTime}</td>
                                                        <td>{outTime}</td>
                                                        <td>{breakTime}</td>
                                                        <td>{record.work_duration}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFromToAttendance;
