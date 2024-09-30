import React from 'react'
import { useState} from 'react';
import './Setting.css'
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import Emailedit from './Emailedit';
import PhoneEdit from './PhoneEdit';
import PasswordEdit from './PasswordEdit';
const SettingModal = ({ isOpen, onClose }) => {
    const [emailModalOpen,setEmailModalOpen]=useState(false);
    const [passwordModalOpen,setPasswordModalOpen]=useState(false);
    const [phoneModalOpen,setPhoneModalOpen]=useState(false);
    const openEmailModal = () =>{
        setEmailModalOpen(true);
         onClose();
    }
    const openPhoneModal = () =>{
        setPhoneModalOpen(true)
        onClose();
    }
    const openPasswordModal = () =>{
        setPasswordModalOpen(true)
        onClose();
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
                    <CModalTitle id="LiveDemoExampleLabel">Setting</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <div className='setting_btn'>
                        <div className='emailChange'>
                            <button className='emailChange-btn' onClick={openEmailModal}>Change Email</button>
                        </div>
                        <div className='emailChange'>
                            <button className='emailChange-btn' onClick={openPhoneModal} >Change Phone</button>
                        </div>
                        <div className='emailChange'>
                            <button className='emailChange-btn' onClick={openPasswordModal} >Change Password</button>
                        </div>
                    </div>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={onClose}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <Emailedit isOpen={emailModalOpen} onClose={() => setEmailModalOpen(false)}/>
            <PasswordEdit isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}/>
            <PhoneEdit isOpen={phoneModalOpen} onClose={() => setPhoneModalOpen(false)}/>
        </div>
    )
}

export default SettingModal
