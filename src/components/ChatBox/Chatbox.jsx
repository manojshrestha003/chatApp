import React, { useContext, useEffect, useState } from 'react'
import './Chatbox.css'
import assets from '../../assets/assets'
import { AppContext } from '../../Context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'

const Chatbox = () => {
  const {userData ,messages, setMessages, messagesIdm,  chatuser} = useContext(AppContext);
  const [input, setInput]= useState('');


  
  useEffect(()=>{
    if(messagesIdm){
      const unSub = onSnapshot(doc(db, 'messages', messagesIdm), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages);
      });
      return () => {
        unSub();
      };
    }
  }, [messagesIdm]);
   
  const sendMessage = async () => {
    try {
      if(input && messagesIdm){
        await updateDoc(doc(db, 'messages', messagesIdm), {
          messages: arrayUnion({
            sId:userData.id,
            text:input,
            createdAt:new Date()
          })
        })
      }
      
      const userIDs = [chatuser.rId.userData.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'chats',id);
        const userChatsSnapshot =  await getDoc(userChatsRef);
        if(userChatsSnapshot.exists()){
          const userChatData =  userChatsSnapshot.data();
          const chatIndex = userChatData.chatData.findIndex(chat => chat.messagesIdm === messagesIdm);
          userChatData.chatData[chatIndex].lastMessage = input.slice(0,30);
          userChatData.chatData[chatIndex].updatedAt= Date.now();
          if(userChatData.chatData[chatIndex].rId ===userData.id){
            userChatData.chatData[chatIndex].messageSeen = false;
          }
          await updateDoc(userChatsRef, {
            chatData:userChatData.chatData
          })
        }
      })
    } catch (error) {
      toast.error('Error sending message');
      

    }
  }
  
  return chatuser? (
    <div className='chatbox'>
      <div className="chatuser">
        <img src={chatuser.userData.avatar} alt="" />
        <p>{chatuser.userData.name} <img src={assets.green_dot} className='dot' alt="" /></p>
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
        <input onChange={(e)=>{setInput(e.target.value)}} value={input} type="text" placeholder='Send a message' />
        <input type="file" id='image' accept='image/png,  image/jpeg' hidden />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img onClick={sendMessage} src={assets.send_button} alt="" />
      </div>
    </div>
  ): <div className='chat-welcome'>
     <img src={assets.logo_icon} alt="" />
     <p>Chat any time</p>
  </div>
}

export default Chatbox