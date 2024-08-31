import React from 'react'
import { useState } from 'react';
import './AttendanceData.css'
import Navbar from '../../Component/Navigation/Navbar';
import {server} from '../../Server';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';

const UserFromToAttendance = () => {
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
            const response = await server.get('/attendance/dateRange-userAttendancereport/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
                params: {
                    from_date: fromDate,  
                    to_date: toDate      
                }
            });
           if (response.status === 200) {
                setAttendanceData(response.data);
                console.log(attendanceData)
            } else {
                // Handle error responses
                const errorData = await response.json();
                handleError(errorData.error || errorData.message || 'An unknown error occurred.');
            }
        } catch (response) {
          handleError('An error occurred while fetching the data.');
        }
    }
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
                <div className='attendance-heading'>Date Attendence</div>
                <div className='user-AttendanceData'>
                        <div className='cover-user-Attendance'>
                        <form  className='date-form' onSubmit={Handledate}>
                        <div className='input-date'>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    className='date-input todate'
                                    onChange={(e) => SetfromDate(e.target.value.trim())}
                                />
                                <input
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
                                        <h2 className='date-wise'>Date: {date}</h2>
                                        <table className='attendance-table'>
                                            <thead className='attendance-thead'>
                                                <tr>
                                                    <td>User Name</td>
                                                    <td>In Time</td>
                                                    <td>Out Time</td>
                                                    <td>Break Time</td>
                                                    <td>Working Time</td>
                                                </tr>
                                            </thead>
                                            <tbody className='attendance-tbody'>
                                                {groupedData[date].map((data, idx) => {
                                                    const inTime = new Date(data.in_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                    const outTime = data.out_timestamp ? new Date(data.out_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
                                                    const breakTime = data.break_duration.split('.')[0];
                                                    return (
                                                        <tr key={idx}>
                                                            <td>{data.user_name}</td>
                                                            <td>{inTime}</td>
                                                            <td>{outTime}</td>
                                                            <td>{breakTime}</td>
                                                            <td>{data.work_duration}</td>
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
                </div>
                </div>
    </div>
  )
}

export default UserFromToAttendance
