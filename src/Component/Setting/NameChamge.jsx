import React from 'react'
import { useState, useEffect } from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
const NameChamge = ({ isOpen, onClose }) => {
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');
    const [successChangeModal, setSuccessChangeModal] = useState(false);
    const handleError = (e) => {
        setMessage(e);
        setMessageColor('red');
        setTimeout(() => {
            setMessage('');
        }, 2000);
    };

    const handleSuccess = (e) => {
        setMessage(e);
        setMessageColor('green');
        setSuccessChangeModal(true);
        setTimeout(() => {
            setMessage('');
            setSuccessChangeModal(false);
            onClose();
        }, 2000);
    };
    const getName = (e) => {
        e.preventDefault();
        if (!fname || !lname) {
            handleError('first name and last name are required.');
            return;
        }
        
        else {
            server.post(
                '/api/users/update-Name/', {
                f_name:fname,
                l_name:lname,
            }
            )
                .then((response) => {
                    handleSuccess('name successfully updated.');
                    onClose();
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });


        }

    }
    return (
        <div>
            <CModal
                visible={isOpen}
                onClose={onClose}
                backdrop="static"
                aria-labelledby="LiveDemoExampleLabel"
                alignment="center"
            >
                <CModalHeader onClose={onClose}>
                    <CModalTitle id="LiveDemoExampleLabel">Change Name </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='setting_form'>
                        <form className='' onSubmit={getName}>
                            <label htmlFor="Email">First Name</label>
                            <div className='setting-input-email'>
                                <input
                                    type="text"
                                    name="text"
                                    id="email"
                                    className='setting-email-input'
                                    onChange={(e) => setFname(e.target.value.trim())}
                                />

                            </div>
                            <div className='setting-input-email'>
                                <label htmlFor="Email">Last name</label>
                                <input
                                    type="text"
                                    name="text"
                                    id="email"
                                    className='setting-email-input'
                                    onChange={(e) => setLname(e.target.value.trim())}
                                />
                            </div>
                            <p style={{ color: messageColor }}>{message}</p>
                            <div className='input-email-button'>
                                <button className='old-email-btn' type="submit">Update Name</button>
                            </div>
                        </form>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={onClose}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal
                visible={successChangeModal}
                onClose={() => setSuccessChangeModal(false)}
                backdrop="static"
            >
                <CModalHeader>
                    <CModalTitle>Password Updated</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Password has been successfully updated.</p>
                </CModalBody>
                <CModalFooter>
                    <CButton color="primary" onClick={() => setSuccessChangeModal(false)}>
                        OK
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    )
}

export default NameChamge
