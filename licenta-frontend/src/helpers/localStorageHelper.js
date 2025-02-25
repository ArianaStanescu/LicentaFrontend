export const USER_DATA_KEY = 'userData';
export const USER_EMAIL_KEY = 'userEmail';

export const getUserEmail = () => {
    return localStorage.getItem(USER_EMAIL_KEY);
}

export const setUserEmail = (email) => {
    localStorage.setItem(USER_EMAIL_KEY, email);
}

export const removeUserEmail = () => {
    localStorage.removeItem(USER_EMAIL_KEY);
}

export const getUserIdLocalStorage =  () => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (userData === null) {
        return null;
    }
    return JSON.parse(userData).id;
}

export const getUserLocalStorage = () => {
    const localUser = localStorage.getItem(USER_DATA_KEY);
    if (localUser === null) {
        return null;
    }
    return JSON.parse(localUser);
}

export const setUser = (userData) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
}

export const removeUser = () => {
    localStorage.removeItem(USER_DATA_KEY);
}

export const setAccessToken = (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
}

export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
};

export const clearAccessToken = () => {
    localStorage.removeItem("accessToken");
}

export const getStoredRefreshToken = () => {
    localStorage.getItem('refreshToken');
}

export const storeRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
}

export const clearRefreshToken = () => {
    localStorage.removeItem('refreshToken');
}

export const clearStoredTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};