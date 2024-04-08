import React from 'react'
import './css/Login.css'
function Login() {
  return (
    <div className='container'>
      <div className='profile'>
      <span class="material-symbols-outlined profile-logo">
account_circle
</span>
      </div>
      <h1 className='h1'>LOGIN</h1>
      <form className='form'>
      <div className='flex'><span class="material-symbols-outlined">
          person 
        </span>Username<br/></div>
      <input type="text" placeholder='Enter Name' className='name' required/><br/>
      <div className='pass'>
      <span class="material-symbols-outlined">
            lock
          </span>Password<br/></div>
      <input type="Password" placeholder='Enter Password' className='name' required/><br/>
      <button className='regis'>LOGIN</button>

      </form>
    </div>
  )
}

export default Login
