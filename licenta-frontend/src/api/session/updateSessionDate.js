import {BASE_URL, instance} from "../axiosInstance";

export const updateSessionDate = async (sessionId, sessionData) => {
    const url = `${BASE_URL}/api/sessions/update-date/${sessionId}`;

    try {
        const response = await instance.put(url, sessionData);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error updating session with id ${sessionId}:`, error);
        return null;
    }
};