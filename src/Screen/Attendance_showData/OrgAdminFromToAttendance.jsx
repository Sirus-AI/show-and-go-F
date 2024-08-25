import React from 'react'
import { useState,useEffect } from 'react';
import './AttendanceData.css'
import Navbar from '../../Component/Navigation/Navbar';
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
                <div className='attendance-heading'>Date Attendence</div>
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
                                
                                <table className='attendance-table'>
                                <thead className='attendance-thead'>
                                        <tr>
                                            <td>From Date</td>
                                            <td>To Date</td>
                                            <td>Data 1</td>
                                            <td>Data 2</td>
                                            <td>Data 3</td>
                                            <td>Data 4</td>
                                            <td>Data 5</td>
                                            <td>Data 7</td>
                                        </tr>
                                    </thead>
                                    <tbody className='attendance-tbody'>
                                        <tr>
                                            <td>455</td>
                                            <td>585</td>
                                            <td>58</td>
                                            <td>588</td>
                                            <td>585</td>
                                            <td>55</td>
                                            <td>585</td>
                                            <td>55</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrgAdminFromToAttendance
