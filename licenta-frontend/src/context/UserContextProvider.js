import React, {createContext, useEffect, useState} from "react";
import {getUserIdLocalStorage, getUserLocalStorage} from "../helpers/localStorageHelper";

export const UserContext = createContext();

const UserContextProvider = ({children}) => {
    const [userId, setUserId] = useState();

    useEffect(() => {
        initUser();
    }, []);

    const getUserId = () => {
        return userId;
    }

    const getUser = () => {
        return getUserLocalStorage();
    }

    const initUser = () => {
        const userIdLocalStorage = getUserIdLocalStorage();
        setUserId(userIdLocalStorage);
    }

    const isTrainer = () => {
        const user = getUser();
        return user?.birthDate != null;
    }

    return (
        <UserContext.Provider
            value={{
                getUserId,
                getUser,
                initUser,
                isTrainer,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
