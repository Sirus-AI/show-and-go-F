import React from 'react'
import './css/Register.css'

function Register() {
  return (
    <div className='container'>

      <h1>REGISTRATION</h1>
      <form className='form'>
      <div className='input'>
        <span class="material-symbols-outlined">
          person
        </span>
        <label className='user'>Organisation*</label><br />
        <input type="text" placeholder='Enter Name' className='name' required /><br /> 
        </div>
        <div className="input">
        <span class="material-symbols-outlined">
          mail
        </span>
        <label className='user'>Email*</label><br />
        <input type="text" placeholder='abc@email.com' className='name' required/><br />
        </div>
        <div className="input">
        <span class="material-symbols-outlined">
          call
        </span>
        
          <label className='user'>Phone no*</label><br />

          <input type="text" placeholder='xxxxxxxxxxx' className='name' required /><br />
          </div>
          <div className="input">
          <span class="material-symbols-outlined">
            lock
          </span>
          <label className='user'>Password</label><br />

          <input type="password" placeholder=' Enter Password' className='name' required /><br /> </div>
          <div className="input">


          <span class="material-symbols-outlined">
lock_open
</span>

          <label className='user'>Confirm Password</label><br />

          <input type="password" placeholder='Confirm password' className='name' required/><br />
          </div>
          <button className='regis'>REGISTER</button>






      </form>


    </div>

  )
}

export default Register
