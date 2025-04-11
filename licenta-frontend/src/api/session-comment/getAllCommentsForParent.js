import {BASE_URL, instance} from "../axiosInstance";

export const getAllCommentsForParent = async (parentId, sessionId) => {
    const url = `${BASE_URL}/api/session-comments/list-by-parent/${sessionId}/${parentId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching comments for parent with id ${parentId}:`, error);
        return null;
    }
};