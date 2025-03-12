import {createContext} from "react";
import {
    clearTokensAndUsers,
    getAccessToken,
    getParentId,
    getStoredRefreshToken,
    getTrainerId
} from "../helpers/localStorageHelper";
import {jwtDecode} from "jwt-decode";
import {refreshToken as refreshTokenFunction} from "../services/keycloak";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const isLoggedIn = async () => {
        if (await getValidAccessToken() && (getParentId() || getTrainerId())) {
            return true;
        }
        return false;
    }

    const isTrainer = () => {
        return getTrainerId() !== null;
    }

    const isParent = () => {
        return getParentId() !== null;
    }

    const isRefreshTokenValid = () => {
        const refreshToken = getStoredRefreshToken();
        const accessToken = getAccessToken();

        if (!refreshToken || !accessToken) {
            return false;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const refreshTokenExpiryDate = jwtDecode(refreshToken).exp;
        return !(refreshTokenExpiryDate < currentTime);
    }

    const getValidAccessToken = async () => {
        let accessToken = getAccessToken();
        let refreshToken = getStoredRefreshToken();
        if (accessToken && refreshToken) {
            const currentTime = Math.floor(Date.now() / 1000);
            const tokenExpiry = jwtDecode(accessToken).exp;

            //if expired
            if (tokenExpiry < currentTime) {
                const refreshTokenExpiryDate = jwtDecode(refreshToken).exp;
                if (refreshTokenExpiryDate < currentTime) {
                    return null;
                }
                try {
                    await refreshTokenFunction();
                } catch (e) {
                    return null;
                }
                return getAccessToken();
            }
            return accessToken;
        }
        return null;
    }

    const logout = () => {
        clearTokensAndUsers();
    };

    return (
        <AuthContext.Provider
            value={{
                logout,
                isTrainer,
                isParent,
                getValidAccessToken,
                isRefreshTokenValid,
                isLoggedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
