import React, { useContext, useState } from "react";
import "./LeftSidebar.css";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/Firebase";
import { AppContext } from "../../Context/AppContext";
import { toast } from "react-toastify";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData, setChatData , chatuser, setChatUser,messagesIdm,setMessagesId} = useContext(AppContext);
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState(false);

  const inputHandler = async (event) => {
    try {
      const input = event.target.value.trim().toLowerCase();
      if (!input) {
        setSearch(false);
        setUsers(null);
        return;
      }

      setSearch(true);
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", input));
      const querySnap = await getDocs(q);

      if (!querySnap.empty) {
        const fetchedUser = querySnap.docs[0].data();
        if (fetchedUser.id !== userData.id) {
          setUsers(fetchedUser);
        } else {
          setUsers(null);
        }
      } else {
        setUsers(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Error fetching user");
    }
  };

  const addChat = async () => {
    if (!users) return;
  
    try {
      // Check if chat already exists
      const chatExists =
        Array.isArray(chatData) &&
        chatData.some((chat) => chat.rId === users.id);
  
      if (chatExists) {
        toast.info("Chat already exists!");
        return;
      }
  
      const messageRef = collection(db, "messages");
      const chatsRef = collection(db, "chats");
  
      // Create new message document
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: [],
      });
  
      // Define chat data
      const newChatData = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: users.id,
        updatedAt: Date.now(),
        messageSeen: true,
      };
  
      // Ensure the chat document exists for both users
      await setDoc(doc(chatsRef, users.id), { chatData: [] }, { merge: true });
      await setDoc(doc(chatsRef, userData.id), { chatData: [] }, { merge: true });
  
      // Update chat data for both users
      await updateDoc(doc(chatsRef, users.id), {
        chatData: arrayUnion({ ...newChatData, rId: userData.id }),
      });
  
      await updateDoc(doc(chatsRef, userData.id), {
        chatData: arrayUnion(newChatData),
      });
  
      // Update local chat data state
      setChatData((prev) => [...prev, newChatData]);
      toast.success("Chat added successfully!");
    } catch (error) {
      toast.error("Error adding chat: " + error.message);
      console.error("Error adding chat:", error);
    }
  };
  const setChat = async(item)=>{
    setMessagesId(item.messagesIdm);
    setChatUser(item);
    
  }
  

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="Logo" />
          <div className="menu">
            <img src={assets.menu_icon} alt="Menu" />
            <div className="sub-menu">
              <p onClick={() => navigate("/profile")}>Edit Profile</p>
              <hr />
              <p>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={assets.search_icon} alt="Search" />
          <input onChange={inputHandler} type="text" placeholder="Search Here" />
        </div>
      </div>

      <div className="ls-list">
  {search && users ? (
    <div onClick={addChat} className="friends add-user">
      <img src={users.avatar} alt="User" />
      <p>{users.name}</p>
    </div>
  ) : Array.isArray(chatData) && chatData.length > 0 ? (
    chatData.map((item, index) => (
      <div
        key={index}
       onClick={()=>{setChat(item)}}
        className="friends"
      >
        <img src={item.userData.avatar} alt="Profile" />
        <div>
          <p>{item.userData.name}</p>
          <span>{item.userData.lastMessage || "No messages yet"}</span>
        </div>
      </div>
    ))
  ) : (
    <p>No chats available</p>
  )}
</div>

    </div>
  );
};

export default LeftSidebar;
