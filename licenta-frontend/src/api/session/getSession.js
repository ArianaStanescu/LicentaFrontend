import {BASE_URL, instance} from "../axiosInstance";

export const getSession = async (sessionId, isTrainer, userId) => {
    const url = `${BASE_URL}/api/sessions/${sessionId}?isTrainer=${isTrainer}&userId=${userId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching session with id ${sessionId}:`, error);
        return null;
    }
};