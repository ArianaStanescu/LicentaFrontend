import {BASE_URL, instance} from "../axiosInstance";

export const getSessionsByGroup = async (groupId, isTrainer, userId, params) => {
    const url = `${BASE_URL}/api/sessions/list/${groupId}?isTrainer=${isTrainer}&userId=${userId}`;

    try {
        const response = await instance.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching sessions for group with id ${groupId}:`, error);
        return null;
    }
};