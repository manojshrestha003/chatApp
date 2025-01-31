import React from 'react'
import './Chatbox.css'
import assets from '../../assets/assets'

const Chatbox = () => {
  
  return (
    <div className='chatbox'>
      <div className="chatuser">
        <img src={assets.profile_img} alt="" />
        <p>Manoj Shrestha  <img src={assets.green_dot} className='dot' alt="" /></p>
        <img src={assets.help_icon} className = "help"alt="" />
      </div>

     <div className="chatmessage">
      <div className="smsg">
        <p className='message'>Lorem ipsum dolor sit amet.</p>
        <div>
          <img src={assets.profile_img} alt="" />
          <p>2:30</p>
          
        </div>
      </div>

      <div className="smsg">
        <img className='msg-img' src={assets.pic1} alt="" />
        <div>
          <img  src={assets.profile_img} alt="" />
          <p>2:30</p>
          
        </div>
      </div>

      <div className="rmsg">
        <p className='message'>Lorem ipsum dolor sit amet.</p>
        <div>
          <img src={assets.profile_img} alt="" />
          <p>2:30</p>
          
        </div>
      </div>
     </div>

     

      <div className="chatinput">
        <input type="text" placeholder='Send a message' />
        <input type="file" id='image' accept='image/png,  image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} alt="" />
      </div>
    </div>
  )
}

export default Chatbox
