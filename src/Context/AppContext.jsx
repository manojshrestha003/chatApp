import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useState, useEffect, useRef } from "react";
import { auth, db } from "../config/Firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const lastSeenIntervalRef = useRef(null); // Use ref instead of state

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) {
                console.error("User data not found.");
                return;
            }

            const fetchedUserData = userSnap.data();
            console.log("User Data:", fetchedUserData);

            setUserData(fetchedUserData);
            await updateDoc(userRef, { lastSeen: Date.now() });

            if (fetchedUserData.avatar && fetchedUserData.name) {
                navigate('/chat');
            } else {
                navigate('/profile');
            }

            if (lastSeenIntervalRef.current) clearInterval(lastSeenIntervalRef.current);

            const interval = setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, { lastSeen: Date.now() });
                }
            }, 60000);

            lastSeenIntervalRef.current = interval;

        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    useEffect(() => {
        return () => {
            if (lastSeenIntervalRef.current) clearInterval(lastSeenIntervalRef.current);
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

            try {
                const tempData = await Promise.all(chatItems.map(async (item) => {
                    const userRef = doc(db, "users", item.rId);
                    const userSnap = await getDoc(userRef);
                    return userSnap.exists() ? { ...item, userData: userSnap.data() } : null;
                }));

                setChatData(tempData.filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt));
            } catch (error) {
                console.error("Error fetching chat user data:", error);
            }
        });

        return () => unSub(); // Clean up Firestore listener
    }, [userData]);

    return (
        <AppContext.Provider value={{ userData, setUserData, chatData, setChatData, loadUserData }}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
