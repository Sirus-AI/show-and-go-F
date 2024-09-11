import React from 'react'
import { useState,useEffect } from 'react';
import './AttendanceData.css'
import Navbar from '../Navigation/Navbar';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import {server} from '../../Server';
const OrgAdminFromToAttendance = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [toDate ,SetToDate]=useState()
    const [fromDate ,SetfromDate]=useState()
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const [messageColor, setMessageColor] = useState('green');
    const[attendanceData , setAttendanceData]=useState()
    const toggleSidebar = () => {
  setIsNavbarOpen(!isNavbarOpen);
};
const handleError = (e) => {
    setVisible(true);
    setMessage(e);
    setMessageColor('red')
  }
  
  const Handledate = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    if (!toDate || !fromDate) {
        handleError('Both "To Date" and "From Date" are required.');
    } else if (new Date(toDate) > new Date(currentDate) || new Date(fromDate) > new Date(currentDate)) {
        handleError('Dates should not be greater than the current date.');
    } else if (toDate === fromDate) {
        handleError('"To Date" cannot be the same as "From Date".');
    } else if (new Date(toDate) < new Date(fromDate)) {
        handleError('"To Date" cannot be earlier than "From Date".');
    } else {
        try {
            const response = await server.get('/attendance/dateRange-attendance-report/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
                params: {
                    from_date: fromDate,  // Updated to match the backend parameter names
                    to_date: toDate       // Updated to match the backend parameter names
                }
            });
            setAttendanceData(response.data);
        } catch (error) {
            console.log(error);
            handleError('An error occurred while fetching the data.');
        }
    }
};
const groupDataByDate = () => {
        const grouped = {};
        attendanceData.forEach((user) => {
            user.attendance.forEach((record) => {
                if (!grouped[record.date]) {
                    grouped[record.date] = [];
                }
                grouped[record.date].push({
                    user: user.user,
                    ...record,
                });
            });
        });
        return grouped;
    };
const groupedData = attendanceData ? groupDataByDate() : {};
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
            {/* <Navbar toggleSidebar={toggleSidebar} />
            <div className='dashboard-content'>
                <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}> */}
                <div className='user-AttendanceData'>
                <div className='attendance-heading'>Custom Date Report</div>
                        <div className='cover-user-Attendance'>
                            
                            <form className='date-form' onSubmit={Handledate}>
                                <div className='input-date'>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    className='date-input todate'
                                    onChange={(e) => SetfromDate(e.target.value.trim())}
                                /> <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    className='date-input fromdate'
                                    onChange={(e) => SetToDate(e.target.value.trim())}
                                />
                           </div>
                            
                            <div className='input-date-button'>
                                <button type="submit" className='show-go-btn'>Select</button>
                            </div>
                            </form>
                            <div className='attendance-table-cover'>
                            {attendanceData && Object.keys(groupedData).map((date, index) => (
                            <div key={index} className="attendance-date-group">
                                <h2 className="date-wise">Date: {date}</h2>
                                <table className="attendance-table">
                                    <thead className="attendance-thead">
                                        <tr>
                                            <td>User Name</td>
                                            <td>First In</td>
                                            <td>Last Out</td>
                                            <td>Total Working Duration</td>
                                            <td>Total Break Duration</td>
                                        </tr>
                                    </thead>
                                    <tbody className="attendance-tbody">
                                        {groupedData[date].map((data, idx) => (
                                            <tr key={idx}>
                                                <td>{data.user}</td>
                                                <td>{data.first_in}</td>
                                                <td>{data.last_out}</td>
                                                <td>{data.total_work_duration}</td>
                                                <td>{data.total_break_duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                            </div>
                        </div>

                    </div>
                </div>
        //     </div>
        // </div>
    )
}
export default OrgAdminFromToAttendance