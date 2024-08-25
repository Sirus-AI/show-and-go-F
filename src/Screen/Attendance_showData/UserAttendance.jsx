import React from 'react'
import { useState } from 'react';
import './AttendanceData.css'
import Navbar from '../../Component/Navigation/Navbar';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
const UserAttendance = () => {
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [date, SetDate] = useState();
    const toggleSidebar = () => {
        setIsNavbarOpen(!isNavbarOpen);
    };
    return (
        <div>
            <Navbar toggleSidebar={toggleSidebar} />
            <div className='dashboard-content'>
                <div className={isNavbarOpen ? 'content-cover' : 'content-toggle'}>
                    <div className='user-AttendanceData'>
                    <div className='attendance-heading'>Daily Attendence</div>
                        <div className='cover-user-Attendance'>
                        <form  className='date-form'>
                        <div className='input-date'>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    className='userDate'
                                    onChange={(e) => SetDate(e.target.value.trim())}
                                />
                                </div>
                            

                            <div className='input-date-button'>
                                <button className=''>Select</button>
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
