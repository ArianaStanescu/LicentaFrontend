import { BASE_URL, instance } from "../axiosInstance";

export const createSessionDocument = async (sessionId, formData) => {
    const url = `${BASE_URL}/api/session-documents/create/${sessionId}`;

    try {
        const response = await instance.post(url, formData);

        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error(`Eroare la încărcarea documentului pentru sesiunea ${sessionId}:`, error);
        return { success: false, error: error.message };
    }
};
