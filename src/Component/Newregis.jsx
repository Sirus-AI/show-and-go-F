import React from 'react'
import './css/Newregis.css'
import { Link } from 'react-router-dom'


function Newregis() {
  return (
    <div className='box'>
      <form>
        <h1>Registration</h1>
        <div className='flex'>
        <input type="text" placeholder='First Name' required className='user'/> <input type="text" placeholder='Last Name' required className='user'/>
        <input type="text" placeholder='@ Email' required className='email'/>
        <input type="text" placeholder='Contact no' required className='email'/>
         
        <input type="Password" placeholder='Password' required className='email'/>
        <input type="password" placeholder='Confirm Password' required className='email'/>
        </div>
        <div className='radio'>
        Create account as :
           <input type="radio" name='r1' required />Admin
        <input type="radio" name='r1' required />User
        
          
         </div>
        <button>SUBMIT</button>
        <p>Already have an account ?
       </p>
        
      </form>
    </div>
  )
}

export default Newregis
