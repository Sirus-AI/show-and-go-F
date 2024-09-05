import React from 'react'
import { useState, useEffect } from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
const ChangePhone = ({ isOpen, onClose }) => {
    const [phone, setphone] = useState();
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
    const getPassword = (e) => {
        e.preventDefault();
        if (!phone) {
            handleError('phone are required.');
            return;
        }
        
        else {
            server.post(
                '/api/users/update-Password/', {
                    phone: phone,
            }
            )
                .then((response) => {
                    handleSuccess('Password successfully updated.');
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
                    <CModalTitle id="LiveDemoExampleLabel">Change phone</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='setting_form'>
                        <form className='' onSubmit={getPassword}>
                            <label htmlFor="Email">New password</label>
                            <div className='setting-input-email'>
                                <input
                                    type="password"
                                    name="password"
                                    id="email"
                                    className='setting-email-input'
                                    onChange={(e) => setphone(e.target.value.trim())}
                                />

                            </div>
                           
                            <p style={{ color: messageColor }}>{message}</p>
                            <div className='input-email-button'>
                                <button className='old-email-btn' type="submit">Update phone</button>
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
                    <CModalTitle>phone number Updated</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>phone number has been successfully updated.</p>
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

export default ChangePhone
