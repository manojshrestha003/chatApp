import React, { useContext, useState } from 'react'
import './LeftSidebar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../config/Firebase'
import { AppContext } from '../../Context/AppContext'
import { toast } from "react-toastify"

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatsData } = useContext(AppContext);
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState(false);
  const inputHandler = async (event) => {
    try {
      const input = event.target.value;
      if (input) {
        setSearch(true);
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
        
          const userExist = Array.isArray(chatsData) && chatsData.some((chat) => chat.rId === querySnap.docs[0].data().id);
  
          if (!userExist) {
            setUsers(querySnap.docs[0].data());
          }
        } else {
          setUsers(null);
        }
      } else {
        setSearch(false);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Error fetching user");
    }
  };
  
  const addChat = async () => {
    const messageRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: []
      });

      await updateDoc(doc(chatsRef, users.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: users.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });
    } catch (error) {
      toast.error(error.message);
      console.error("Error adding chat:", error);
    }
  };

  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="" />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className='sub-menu'>
              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder='Search Here' />
        </div>
      </div>
      <div className="ls-list">
        {search && users ? (
          <div onClick={addChat} className="friends add-user">
            <img src={users.avatar} alt="" />
            <p>{users.name}</p>
          </div>
        ) : (
          Array.isArray(chatsData) && chatsData.length > 0 ? (
            chatsData.map((item, index) => (
              <div key={index} className="friends">
                <img src={item.userData.avatar} alt="Profile" />
                <div>
                  <p>{item.userData.name}</p>
                  <span>{item.lastMessage}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No chats available</p>
          )
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
