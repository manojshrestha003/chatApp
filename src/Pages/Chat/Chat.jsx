import React from 'react'
import './Chat.css'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import Chatbox from '../../components/ChatBox/Chatbox'
import RightSidebar from '../../components/RightSideBar/RightSidebar'

const Chat = () => {
  return (
    <div className=' Chat'>
        <div className="chat-container">
            <LeftSidebar/>
            <Chatbox/>
            <RightSidebar/>
        </div>
        
      
    </div>
  )
}

export default Chat
