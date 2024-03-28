import React from 'react'
import "./css/Login.css"
function Login() {
    return (
        <div>
            <div className="main">
                <div className="sub-main">
                    <div className="img">
                        <div className="container-image">
                            <img src={profile} alt="profile" className="profile" />

                        </div>
                    </div>
                    <div>
                        <h1>Welcome</h1>
                        <div>
                            <img src={username} alt="user" className="user" />
                            Username <input type="text" placeholder=" Enter Name" className="name" />
                        </div>
                        <div>
                            <img src={password} alt="lock" className="user" />
                            Password <input type="Password" placeholder="Password" className="name" />
                        </div>
                        <div className="btn">
                            <button>Login</button>
                        </div>
                    </div>


                </div>
            </div>
            </div>
            )
}

            export default Login
