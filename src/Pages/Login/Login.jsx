import React , {useState}from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup, login } from '../../config/Firebase'

const Login = () => {
    const [current, setCurrent]= useState("Sign Up")
    const [userName, setUsername]= useState("");
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")

    const onsubmitHandler =(event)=>{
        event.preventDefault();
        if(current==="Sign Up"){
            signup(userName, email, password);
        }else{
            login(email, password)
        }
        
    }

  return (
    <div className='Login'>
        <img  className='Logo' src={assets.logo_big} alt="" />

        <form onSubmit={onsubmitHandler} action="" className='Login-form'>
            <h2>{current}</h2>
            {current==="Sign Up"?<input onChange={(e)=>{setUsername(e.target.value)}} value={userName} type="text" className="form-input" placeholder='Username' required />:null}
            <input onChange={(e)=>{setEmail(e.target.value)}}  value={email} type="email" className="form-input" placeholder='Email Address' required/>
            <input onChange={(e)=>{setPassword(e.target.value)}} type="password" className="form-input"  placeholder='password' required/>
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
