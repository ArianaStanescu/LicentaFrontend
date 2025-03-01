export const TRAINER_ID = 'trainerId';
export const PARENT_ID = 'parentId';

export const getTrainerId = () => {
    return localStorage.getItem(TRAINER_ID);
}

export const setTrainerId = (id) => {
    localStorage.setItem(TRAINER_ID, id);
}

export const clearTrainerId = () => {
    localStorage.removeItem(TRAINER_ID);
}

export const getParentId = () => {
    return localStorage.getItem(PARENT_ID);
}

export const setParentId = (id) => {
    localStorage.setItem(PARENT_ID, id);
}

export const clearParentId = () => {
    localStorage.removeItem(PARENT_ID);
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
    return localStorage.getItem('refreshToken');
}

export const setRefreshToken = (token) => {
    localStorage.setItem('refreshToken', token);
}

export const clearRefreshToken = () => {
    localStorage.removeItem('refreshToken');
}

export const clearStoredTokens = () => {
    clearAccessToken();
    clearRefreshToken();
};

export const clearTokensAndUsers = () => {
    clearStoredTokens();
    clearTrainerId();
    clearParentId();
}