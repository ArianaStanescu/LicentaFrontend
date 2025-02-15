import React, {createContext, useState} from "react";

export const UserContext = createContext();

const UserContextProvider = ({children}) => {
    const [user, setUser] = useState();

    const isLoggedIn = () => {
        return true;
    }

    return (
        <UserContext.Provider
            value={{
                isLoggedIn,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
