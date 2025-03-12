import {jwtDecode} from "jwt-decode";

import {getStoredRefreshToken, storeToken, setRefreshToken, setAccessToken} from "../helpers/localStorageHelper";

export const KEYCLOAK_URL = 'http://localhost:8082/';
export const KEYCLOAK_REALM = 'LicentaRealm';
export const KEYCLOAK_CLIENT_ID = 'licenta-backend-client';
const KEYCLOAK_CLIENT_SECRET = '077cf1d2-8767-42c8-8027-91bb0b493de3';
const KEYCLOAK_ADMIN_CLIENT_ID = 'admin-cli';
const KEYCLOAK_ADMIN_REALM = 'master';
const KEYCLOAK_ROLE_TRAINER_ID = '066cd086-3b6d-40c3-adfe-2869b5288fbd';
const KEYCLOAK_ROLE_PARENT_ID = '03b0a304-abea-4d97-aaa1-bf213498efbc';
export const KEYCLOAK_ADMIN_USERNAME = 'admin';
export const KEYCLOAK_ADMIN_PASSWORD = 'admin';

const keycloak_headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
};

// export const getStoredToken = () => localStorage.getItem('accessToken');
// export const getStoredRefreshToken = () => localStorage.getItem('refreshToken');
// export const storeToken = (token) => localStorage.setItem('accessToken', token);
// export const storeRefreshToken = (token) => localStorage.setItem('refreshToken', token);
// export const clearStoredTokens = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
// };

export const refreshToken = async () => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const endpoint = `${KEYCLOAK_URL}realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
    const body = `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}&client_id=${KEYCLOAK_CLIENT_ID}`;
    const options = {
        method: 'POST',
        headers: keycloak_headers,
        body,
    };

    const response = await fetch(endpoint, options);
    const data = await response.json();

    if (data.error) {
        throw new Error(data.error_description);
    }

    setAccessToken(data.access_token);
    if (data.refresh_token) {
        setRefreshToken(data.refresh_token);
    }

    return data.access_token;
};

export const authenticate = async (username, password, isAdmin = false) => {
    try {
        const endpoint = `${KEYCLOAK_URL}realms/${isAdmin ? KEYCLOAK_ADMIN_REALM : KEYCLOAK_REALM}/protocol/openid-connect/token`;
        const body = `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&client_id=${isAdmin ? KEYCLOAK_ADMIN_CLIENT_ID : KEYCLOAK_CLIENT_ID}`;
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: keycloak_headers,
            body,
        };

        const response = await fetch(endpoint, options);
        const data = await response.json();

        if (data.access_token) {
            await setAccessToken(data.access_token);
            if (data.refresh_token) {
                await setRefreshToken(data.refresh_token);
            }

            // This logic is specific to non-admin users, and follows the storage of tokens.
            if (!isAdmin) {
                const decodedAccessToken = jwtDecode(data.access_token);
                const email = decodedAccessToken.email;
                const lastName = decodedAccessToken.family_name;
                const firstName = decodedAccessToken.given_name;

                // console.log("email:", email);
                // console.log("lastName:", lastName);
                // console.log("firstName:", firstName);

            }
        }

        return data;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
};


export const register = async (userData, isTrainer) => {
    try {
        const adminAuthResponse = await authenticate(KEYCLOAK_ADMIN_USERNAME, KEYCLOAK_ADMIN_PASSWORD, true);
        // await removeAccessToken();
        localStorage.removeItem('accessToken');

        if (!adminAuthResponse || !adminAuthResponse.access_token) {
            throw new Error("No access token received from authenticate function");
        }


        const createUserEndpoint = `${KEYCLOAK_URL}admin/realms/${KEYCLOAK_REALM}/users`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminAuthResponse.access_token}`,
            },
            body: JSON.stringify(userData),
        };

        const createUserResponse = await fetch(createUserEndpoint, options);

        if (createUserResponse.status !== 201) {
            const errorMessage = `HTTP Error: ${createUserResponse.status} ${createUserResponse.statusText}`;
            throw new Error(errorMessage);
        }

        const data = await createUserResponse.text();
        const jsonData = data === "" ? {} : JSON.parse(data);
        const keycloakUserId = createUserResponse.headers.get('Location').split('/').pop();

        if (isTrainer) {
            const assignTrainerRoleEndpoint = `${KEYCLOAK_URL}admin/realms/${KEYCLOAK_REALM}/users/${keycloakUserId}/role-mappings/clients/${KEYCLOAK_CLIENT_SECRET}`;
            const roleData =
                [
                    {
                        "id": KEYCLOAK_ROLE_TRAINER_ID,
                        "name": "trainer",
                    }
                ]

            const roleOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminAuthResponse.access_token}`,
                },
                body: JSON.stringify(roleData),
            };

            const assignRoleResponse = await fetch(assignTrainerRoleEndpoint, roleOptions);
            if (assignRoleResponse.status !== 204) {
                const errorMessage = `HTTP Error: ${assignRoleResponse.status} ${assignRoleResponse.statusText}`;
                throw new Error(errorMessage);
            }

        } else {
            const assignParentRoleEndpoint = `${KEYCLOAK_URL}admin/realms/${KEYCLOAK_REALM}/users/${keycloakUserId}/role-mappings/clients/${KEYCLOAK_CLIENT_SECRET}`;
            const roleData =
                [
                    {
                        "id": KEYCLOAK_ROLE_PARENT_ID,
                        "name": "parent",
                    }
                ];
            const roleOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminAuthResponse.access_token}`,
                },
                body: JSON.stringify(roleData),
            };

            const assignRoleResponse = await fetch(assignParentRoleEndpoint, roleOptions);
            if (assignRoleResponse.status !== 204) {
                const errorMessage = `HTTP Error: ${assignRoleResponse.status} ${assignRoleResponse.statusText}`;
                throw new Error(errorMessage);
            }
        }

        return {success: true, data: jsonData, keycloakUserId};
    } catch (error) {
        console.error("Error in register function: ", error);
        return {error: error.message};
    }
};