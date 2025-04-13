import {BASE_URL, instance} from "../axiosInstance";

export const deleteSessionDocument = async (sessionId) => {
    const url = `${BASE_URL}/api/session-documents/${sessionId}`;

    try {
        await instance.delete(url);
    } catch (error) {
        console.error(`Error deleting document session for session with id ${sessionId}:`, error);
        return null;
    }
};