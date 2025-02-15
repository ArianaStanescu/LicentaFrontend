import React, {createContext, useState} from "react";
import {withRouter} from "react-router-dom";

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

export default withRouter(UserContextProvider);
