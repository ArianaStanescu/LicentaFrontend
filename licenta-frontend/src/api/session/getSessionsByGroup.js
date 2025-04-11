import {BASE_URL, instance} from "../axiosInstance";

export const getSessionsByGroup = async (groupId, params) => {
    const url = `${BASE_URL}/api/sessions/list/${groupId}`;

    try {
        const response = await instance.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching sessions for group with id ${groupId}:`, error);
        return null;
    }
};