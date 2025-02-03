import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useState, useEffect } from "react";
import { auth, db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [lastSeenInterval, setLastSeenInterval] = useState(null);

  
    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const fetchedUserData = userSnap.data();
                console.log("User Data:", fetchedUserData);

                setUserData(fetchedUserData);
                
                if (fetchedUserData.avatar && fetchedUserData.name) {
                    navigate('/chat');
                } else {
                    navigate('/profile');
                }

                await updateDoc(userRef, { lastSeen: Date.now() });

                
                if (lastSeenInterval) clearInterval(lastSeenInterval);

                const interval = setInterval(async () => {
                    if (auth.currentUser) {
                        await updateDoc(userRef, { lastSeen: Date.now() });
                    }
                }, 60000);

                setLastSeenInterval(interval);
            } else {
                console.error("User data not found.");
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

  
    useEffect(() => {
        return () => {
            if (lastSeenInterval) clearInterval(lastSeenInterval);
        };
    }, []);

    
    useEffect(() => {
        if (!userData) return;

        const chatRef = doc(db, 'chats', userData.id);
        const unSub = onSnapshot(chatRef, async (res) => {
            if (!res.exists()) {
                console.warn("Chat document does not exist.");
                setChatData([]); 
                return;
            }

            const chatItems = res.data().chatData || [];
            const tempData = [];

            for (const item of chatItems) {
                const userRef = doc(db, "users", item.rId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    tempData.push({ ...item, userData: userSnap.data() });
                }
            }

            setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => unSub(); 
    }, [userData]);

    return (
        <AppContext.Provider value={{ userData, setUserData, chatData, setChatData, loadUserData }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
