import React from 'react'
import { useState, useEffect } from 'react';
import './AttendanceData.css'
import Navbar from '../../Component/Navigation/Navbar';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
const OrgAdminAttendance = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [date, SetDate] = useState();
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState('green');
    const [attendanceData, setAttendanceData] = useState()
    const [org_id, setorg_id] = useState([]);
    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };
    const handleError = (e) => {
        setVisible(true);
        setMessage(e);
        setMessageColor('red')
    }
    const fecthUserOrganisation = async () => {
        server
            .get(`api/org/user-organisation/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            })
            .then((response) => {

                setorg_id(response.data.org_id)
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const Handledate = async (e) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0];

        if (!date) {
            handleError(' Date are required.');
        }
        else if (new Date(date) > new Date(currentDate)) {
            handleError('Dates should not be greater than the current date.');
        }
        else {
            try {
                const response = await server.get('/attendance/singleDate-attendance-report/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': '{{ csrf_token }}',
                    },
                    params: {
                        date: date,
                        org_id: org_id
                    }
                });
                setAttendanceData(response.data);
                

            } catch (error) {
                console.log(error);
                handleError('An error occurred while fetching the data.');
            }
        }
    };
    useEffect(() => {
        fecthUserOrganisation()

    }, []);
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
            <Navbar toggleSidebar={toggleSidebar} />
            <div className='dashboard-content'>
                <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                    <div className='user-AttendanceData'>
                        <div className='attendance-heading'>Daily Attendence</div>
                        <div className='cover-user-Attendance'>
                            <form className='date-form' onSubmit={Handledate}>
                                <div className='input-date'>
                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        className='date-input'
                                        onChange={(e) => SetDate(e.target.value.trim())}
                                    /></div>

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
                                                <td>Date</td>
                                                <td>In Time</td>
                                                <td>Out Time</td>
                                                <td>Working time</td>
                                                <td>Break Time</td>
                                            </tr>
                                        </thead>
                                        <tbody className='attendance-tbody'>
                                            {attendanceData.map((data, index) => {
                                                const inTime = new Date(data.first_in_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                const outTime = data.last_out_timestamp ? new Date(data.last_out_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';

                                                return (
                                                    <tr key={index}>
                                                        <td>{data.user_name}</td>
                                                        <td>{data.date}</td>
                                                        <td>{inTime}</td>
                                                        <td>{outTime}</td>
                                                        <td>{data.total_break_duration}</td>
                                                        <td>{data.total_work_duration}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ):(
                                    <p>No data available for the selected date.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrgAdminAttendance
