import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore"; // FIXED import
import { initializeApp } from "firebase/app";
import { toast } from "react-toastify";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe-DZrb4pWd_14edKeHfG6bbiMVRoREnU",
  authDomain: "chat-app-gs-d09ab.firebaseapp.com",
  projectId: "chat-app-gs-d09ab",
  storageBucket: "chat-app-gs-d09ab.appspot.com", // FIXED storageBucket
  messagingSenderId: "853212970248",
  appId: "1:853212970248:web:1dccc5bd14c004382380bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // FIXED function name

const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, I am Manoj",
      lastSeen: Date.now(),
    });

    await setDoc(doc(db, "chats", user.uid), {
      chatData: [],
    });

  } catch (error) {
    console.error(error);
    toast.error(error.code.split('/')[1].split("-").join(" "))
  }
};

const login =async(email, password)=>{
    try {
        await signInWithEmailAndPassword(auth, email, password)
        
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split("-").join(" "))
    }

    
}

const logout =async()=>{
    try {
        await  signOut(auth)
        
    } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split("-").join(" "))
    
    }
}
export { signup , login, logout, auth, db};
