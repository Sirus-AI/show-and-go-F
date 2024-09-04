import React from 'react'
import { useState,useEffect} from 'react';
import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CButton } from '@coreui/react';
import { server } from '../../Server';
const PhoneEdit = ({ isOpen, onClose }) => {
    const [phone,setPhone]=useState();
    const [otp,setOtp]=useState();
    const [message, setMessage] = useState('');
    const [otpmessage, setOtpMessage] = useState('');
    const [messageColor, setMessageColor] = useState('green');
    const [showOtpInput,setShowOtpInput]=useState(false)

    const handleError = (e) => {
        setMessage(e);
        setOtpMessage(e)
        setMessageColor('red');
        setTimeout(() => {
            setMessage('');
        }, 2000); 
    };
    const otphandleError = (e) => {
        setOtpMessage(e)
        setMessageColor('red');
        setTimeout(() => {
            setOtpMessage('');
        }, 2000); 
    };
    const getPhone= (e)=>{
        e.preventDefault();
        if(!phone){
            handleError(' email are required.');
          
        }
    else{
        server.post(
            'generate-otp/',{
                phone_number:phone
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
    const getotp=(e)=>{
        e.preventDefault();
        if(!otp){
            otphandleError('otp are required.');
            
        }else{
            server.post(
                'verify-otp/',{
                    otp_code:otp
                }
            )
            .then((response) => {
                
            })
            .catch((error) => {
                console.log(error);
            });
        }
        
    }
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.user && userData.user.email) {
            setPhone(userData.user.phone);
        }
    }, []);
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
                    <div className='setting_form'>
                    <form className=''  onSubmit={getPhone}>
                    <label htmlFor="Email">Enter old Phone</label>
                                <div className='setting-input-email'>
                                    <input
                                        type="phone"
                                        name="phone"
                                        id="phone"
                                        value={phone}
                                        className='setting-email-input'
                                         onChange={(e) => setPhone(e.target.value.trim())}
                                    />
                                     <p style={{ color: messageColor }}>{message}</p>
                                    </div>

                                <div className='input-email-button'>
                                    <button className='old-email-btn' type="submit">get-otp</button>
                                </div>
                            </form>
                            {showOtpInput?(
                            <form className='' onSubmit={getotp}>
                            <label htmlFor="otp"> Enter otp</label>
                                <div className='setting-input-email'>
                                    <input
                                        type="number"
                                        name="number"
                                        id="text"
                                        className='setting-email-input'
                                         onChange={(e) =>setOtp(e.target.value.trim())}
                                    />
                                    <p style={{ color: messageColor }}>{otpmessage}</p>
                                    </div>

                                <div className='input-email-button'>
                                    <button className='old-email-btn' type="submit">submit</button>
                                </div>
                            </form>):(null)}
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

export default PhoneEdit
