import React, {createContext, useContext, useEffect, useState} from "react";
import {initializeApp} from "firebase/app";
import {getMessaging, getToken, onMessage, deleteToken} from "firebase/messaging";
import {updateFcmToken} from "../api/updateFcmToken";
import {AuthContext, isTrainer} from "./AuthContextProvider";
import {getParentId, getTrainerId} from "../helpers/localStorageHelper";

const firebaseConfig = {
    apiKey: "AIzaSyAVyGKpytHW0OyCPxc6npNmVZfRlU7bMd0",
    authDomain: "licenta-app-7195c.firebaseapp.com",
    projectId: "licenta-app-7195c",
    storageBucket: "licenta-app-7195c.firebasestorage.app",
    messagingSenderId: "232307961431",
    appId: "1:232307961431:web:1c1864630829c92cbcfd12"
};

export const FirebaseMessagingContext = createContext();

export const FirebaseMessagingProvider = ({children}) => {
    const [token, setToken] = useState(null);
    const [message, setMessage] = useState(null);
    const [refreshNotifications, setRefreshNotifications] = useState(false);

    useEffect(() => {
        if (getTrainerId() || getParentId()) {
             initializeMessaging(isTrainer() ? getTrainerId() : getParentId(), isTrainer());
        }
    }, []);

    const initializeMessaging = async (userId, isTrainer) => {
        if ("serviceWorker" in navigator) {
            await navigator.serviceWorker
                .register("/firebase-messaging-sw.js",
                    {
                        scope: 'firebase-cloud-messaging-push-scope/'
                    });
        }
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.error("Notification permission denied.");
            return;
        }
        const currentToken = await getToken(messaging);
        if (currentToken) {
            setToken(currentToken);
            await updateFcmToken(userId, isTrainer, currentToken);
        }

        onMessage(messaging, (payload) => {
            setMessage(payload);
            showForegroundNotification(payload?.data?.title, payload?.data?.body);
            triggerNotificationsRefresh();
        });
    };

    const clearMessaging = async (userId, isTrainer) => {
        try {
            const app = initializeApp(firebaseConfig);
            const messaging = getMessaging(app);
            await deleteToken(messaging);
            await updateFcmToken(userId, isTrainer, null);
            await clearServiceWorkers();
            setToken(null);
        } catch (error) {
            console.error("Error clearing messaging:", error);
        }
    };

    // Function to display a notification in the foreground
    const showForegroundNotification = (title, body) => {
        if (Notification.permission === "granted") {
            new Notification(title, {
                body: body,
            });
        }
    };

    const clearServiceWorkers = async () => {
        if ("serviceWorker" in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of registrations) {
                    if (registration.scope.includes("firebase-cloud-messaging-push-scope/")) {
                        await registration.unregister();
                        console.log("Service Worker unregistered:", registration.scope);
                    }
                }
                console.log("All Service Workers have been unregistered.");
            } catch (error) {
                console.error("Error unregistering Service Workers:", error);
            }
        }
    }

    const triggerNotificationsRefresh = () => {
        setRefreshNotifications((prev) => !prev);
    };

    return (
        <FirebaseMessagingContext.Provider
            value={{token, message, initializeMessaging, clearMessaging, refreshNotifications}}>
            {children}
        </FirebaseMessagingContext.Provider>
    );
};
