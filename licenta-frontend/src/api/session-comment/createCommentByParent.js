import { BASE_URL, instance } from "../axiosInstance";

export const createCommentByParent = async (parentId, sessionId, comment) => {
    const url = `${BASE_URL}/api/session-comments/create-by-parent/${sessionId}/${parentId}`;

    try {
        const response = await instance.post(url, { content: comment });
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error(`Error creating comment for parent with id ${parentId} at session ${sessionId}:`, error);
        return null;
    }
};