import React from 'react'
import { useState,useEffect} from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
const Changepassword = () => {
    const [email,setEmail]=useState();
    const [message, setMessage] = useState('');
    const [otpmessage, setOtpMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');
    const [changePasswordModalOpen,setChangePasswordModalOpen]=useState(false)
    const handleError = (e) => {
        setMessage(e);
        setMessageColor('red');
        setTimeout(() => {
            setMessage('');
        }, 2000); 
    };
    const getPassword= (e)=>{
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
                setShowOtpInput(true)
            })
            .catch((error) => {
                console.log(error);
            });
            
            
        }
        
    }
  return (
    <div>
      
    </div>
  )
}

export default Changepassword
