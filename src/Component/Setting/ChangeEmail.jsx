import React from 'react'
import { useState,useEffect} from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
const ChangeEmail = ({ isOpen, onClose }) => {
    const [email,setEmail]=useState();
    const [otp,setOtp]=useState();
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
    const getEmail= (e)=>{
        e.preventDefault();
        if(!email){
            handleError(' email are required.');
            return;
        }else{
            server.post(
                '/api/users/update-email/',{
                    email:email
                }
            )
            .then((response) => {
                handleSuccess('Password successfully updated.');
                onClose()
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
           <CModalTitle id="LiveDemoExampleLabel">Change email</CModalTitle>
       </CModalHeader>
       <CModalBody>
           <div className='setting_form'>
           <form className=''  onSubmit={getEmail}>
           <label htmlFor="Email">new Email</label>
                       <div className='setting-input-email'>
                           <input
                               type="email"
                               name="email"
                               id="email"
                               className='setting-email-input'
                                onChange={(e) => setEmail(e.target.value.trim())}
                           />
                            <p style={{ color: messageColor }}>{message}</p>
                           </div>

                       <div className='input-email-button'>
                           <button className='old-email-btn' type="submit">Update email</button>
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
                    <CModalTitle>Email Updated</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <p>Email has been successfully updated.</p>
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

export default ChangeEmail
