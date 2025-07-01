import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {refreshToken} from '../services/keycloak';

export const BASE_URL = 'https://kidsphere.ddns.net/backend';

export const instance = axios.create({
    baseURL: 'https://kidsphere.ddns.net/backend',
});

instance.interceptors.request.use(
    async (config) => {
        if (config.url.startsWith("https://api.openai.com/v1/responses")) {
            return config;
        }
        let accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const currentTime = Math.floor(Date.now() / 1000);
            const tokenExpiry = jwtDecode(accessToken).exp;

            if (tokenExpiry < currentTime) {
                await refreshToken();
                accessToken = localStorage.getItem('accessToken');
            }
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
