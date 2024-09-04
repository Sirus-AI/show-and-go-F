import React from 'react'
import { useState,useEffect} from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
const ChangeEmail = ({ isOpen, onClose }) => {
    const [email,setEmail]=useState();
    const [otp,setOtp]=useState();
    const [message, setMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');
    const [showOtpInput,setShowOtpInput]=useState(false)
    const handleError = (e) => {
        setMessage(e);
        setMessageColor('red');
        setTimeout(() => {
            setMessage('');
        }, 2000); 
    };
    const getEmail= (e)=>{
        e.preventDefault();
        if(!email){
            handleError(' email are required.');
            return;
        }else{
            server.post(
                'generate-otp/',{
                    email:email
                }
            )
            .then((response) => {
                
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
           <label htmlFor="Email">Enter old Email</label>
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
                           <button className='old-email-btn' type="submit">get-otp</button>
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
   
</div>

  )
}

export default ChangeEmail
