import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {refreshToken} from '../services/keycloak';

export const BASE_URL = 'http://localhost:8080';

export const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

instance.interceptors.request.use(
    async (config) => {
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
