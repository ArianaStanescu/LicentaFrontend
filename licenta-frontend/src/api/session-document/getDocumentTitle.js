import {BASE_URL, instance} from "../axiosInstance";

export const getDocumentTitle = async (sessionId) => {
    const url = `${BASE_URL}/api/session-documents/title/${sessionId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching document title with id ${sessionId}:`, error);
        return null;
    }
};