
import {createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import {getFireStore, setDoc } from 'firebase/firestore'
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe-DZrb4pWd_14edKeHfG6bbiMVRoREnU",
  authDomain: "chat-app-gs-d09ab.firebaseapp.com",
  projectId: "chat-app-gs-d09ab",
  storageBucket: "chat-app-gs-d09ab.firebasestorage.app",
  messagingSenderId: "853212970248",
  appId: "1:853212970248:web:1dccc5bd14c004382380bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const db = getFireStore(app)

const signup = async (username, email, password)=>{
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        const user  = res.user;
        await setDoc(doc(db, "users", user.uid), {
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey , I am Manoj",
            lastSeen:Date.now()
        })
        await setDoc(doc(db, "chats", user.uid),{
            chatData:[]
        })

    } catch (error) {
     
        console.error(error)
    }

}