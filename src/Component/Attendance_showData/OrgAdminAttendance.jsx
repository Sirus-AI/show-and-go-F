import React from 'react';
import { useState, useEffect } from 'react';
import './AttendanceData.css';
import Navbar from '../Navigation/Navbar';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';

const OrgAdminAttendance = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [date, setDate] = useState();
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState('green');
    const [attendanceData, setAttendanceData] = useState([]);
    const [org_id, setOrgId] = useState([]);

    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };

    const handleError = (e) => {
        setVisible(true);
        setMessage(e);
        setMessageColor('red');
    };

    const fetchUserOrganisation = async () => {
        try {
            const response = await server.get('api/org/user-organisation/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
            });
            setOrgId(response.data.org_id);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDate = async (e) => {
        e.preventDefault();
        const currentDate = new Date().toISOString().split('T')[0];

        if (!date) {
            handleError('Date is required.');
        } else if (new Date(date) > new Date(currentDate)) {
            handleError('Dates should not be greater than the current date.');
        } else {
            try {
                const response = await server.get(`/attendance/attendance-report/organisation/${org_id}/${date}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': '{{ csrf_token }}',
                    },
                });
                setAttendanceData(response.data);
            } catch (error) {
                console.log(error);
                handleError('An error occurred while fetching the data.');
            }
        }
    };

    useEffect(() => {
        fetchUserOrganisation();
    }, []);

    return (
        <div>
            <CModal visible={visible} onClose={() => setVisible(false)} aria-labelledby="LiveDemoExampleLabel">
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
                    <form className='date-form' onSubmit={handleDate}>
                        <div className='input-date'>
                            <input
                                type="date"
                                name="date"
                                id="date"
                                className='date-input'
                                onChange={(e) => setDate(e.target.value.trim())}
                            />
                        </div>
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
                                        <td>First In</td>
                                        <td>Last Out</td>
                                        <td>Total Working Duration</td>
                                        <td>Total Break Duration</td>
                                    </tr>
                                </thead>
                                <tbody className='attendance-tbody'>
                                    {attendanceData.map((data, index) => (
                                        data.attendance.map((attendance, idx) => (
                                            <tr key={`${index}-${idx}`}>
                                                <td>{data.user}</td>
                                                <td>{attendance.date}</td>
                                                <td>{attendance.first_in}</td>
                                                <td>{attendance.last_out}</td>
                                                <td>{attendance.total_work_duration}</td>
                                                <td>{attendance.total_break_duration}</td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No data available for the selected date.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgAdminAttendance;
