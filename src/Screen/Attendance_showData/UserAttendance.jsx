import React from 'react'
import { useState,useEffect } from 'react';
import './AttendanceData.css'
import Navbar from '../../Component/Navigation/Navbar';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
const UserAttendance = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [date, SetDate] = useState();
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

    if (!date ) {
        handleError(' Date are required.');
    }
    else if (new Date(date) > new Date(currentDate)) {
        handleError('Dates should not be greater than the current date.');
    }
   else {
        try {
            const response = await server.get('/attendance/singleUser-attendance-report/', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}',
                },
                params: {
                   date:date,
                }
            });
            setAttendanceData(response.data);
        } catch (error) {
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
                    <div className='attendance-heading'>Daily Attendence</div>
                        <div className='cover-user-Attendance'>
                        <form  className='date-form'onSubmit={Handledate}>
                        <div className='input-date'>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    className='date-input'
                                    onChange={(e) => SetDate(e.target.value.trim())}
                                />
                                </div>
                            

                            <div className='input-date-button'>
                                <button className='show-go-btn' type="submit">Select</button>
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

export default UserAttendance
