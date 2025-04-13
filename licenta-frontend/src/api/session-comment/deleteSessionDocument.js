import { BASE_URL, instance } from "../axiosInstance";

export const deleteSessionComment = async (id) => {
    const url = `${BASE_URL}/api/session-comments/${id}`;

    try {
        await instance.delete(url);
    } catch (error) {
        console.error(`Error deleting document session comment with id ${id}:`, error);
        return null;
    }
};