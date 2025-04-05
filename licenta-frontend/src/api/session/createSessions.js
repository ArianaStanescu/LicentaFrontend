import {BASE_URL, instance} from "../axiosInstance";

export const createSessions = async (groupId) => {
    const url = `${BASE_URL}/api/sessions/create/${groupId}`;

    try {
        const response = await instance.post(url);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error creating sessions for group with id ${groupId}:`, error);
        return null;
    }
};