import {createContext, useContext, useEffect, useState} from "react";
import {USER_DATA_KEY} from "../helpers/localStorageHelper";
import {UserContext} from "./UserContextProvider";

export const AuthContext = createContext();

export const AuthContextProvider  = ({children}) => {
    const [user, setUser] = useState();
    const {initUser, isTrainer} = useContext(UserContext);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = () => {
        try {
            const userData = localStorage.getItem(USER_DATA_KEY);

            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (error) {
            console.log("Error getting user data from local storage: ", error);
        }
    };

    const login = (userData) => {
        try {
            setUser(userData);
            initUser();
        } catch (error) {
            console.log("Error setting user data in local storage: ", error);
        }
    };

    const logout = () => {
        try {
            setUser(null);
            localStorage.removeItem(USER_DATA_KEY);
        } catch (error) {
            console.log("Error removing user data from local storage: ", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isTrainer,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
