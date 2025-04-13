import { BASE_URL, instance } from "../axiosInstance";

export const createCommentByTrainer = async (trainerId, sessionId, comment) => {
    const url = `${BASE_URL}/api/session-comments/create-by-trainer/${sessionId}/${trainerId}`;

    try {
        const response = await instance.post(url, { content: comment });
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error(`Error creating comment for trainer with id ${trainerId} at session ${sessionId}:`, error);
        return null;
    }
};