import React , {useState}from 'react'
import './Login.css'
import assets from '../../assets/assets'

const Login = () => {
    const [current, setCurrent]= useState("Sign Up")
  return (
    <div className='Login'>
        <img src={assets.logo_big} alt=""  className='Logo'/>

        <form action="" className='Login-form'>
            <h2>{current}</h2>
            {current==="Sign Up"?<input type="text" className="form-input" placeholder='Username' required />:null}
            <input type="email" className="form-input" placeholder='Email Address' required/>
            <input type="password" className="form-input"  placeholder='password' required/>
            <button type='submit'> {current==="Sign Up"?"Create account":"Login now"}</button>

            <div className="login-term">
                <input type="checkbox" />
                <p>Agree to the terms of use and privacy policy</p>
            </div>
            <div className='login-forgot'>
                {
                    current==="Sign Up"?  <p className="loginToggle">Already have an account <span onClick={()=>{setCurrent("Login")}}>Login here</span> </p>:<p className="loginToggle">Create an account  <span onClick={()=>{setCurrent("Sign Up")}}>Click Here </span> </p>
                }
                
                
            </div>
        </form>
      
    </div>
  )
}

export default Login
