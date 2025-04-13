import { BASE_URL, instance } from "../axiosInstance";

export const editCommentByTrainer = async (trainerId, sessionCommentId, comment) => {
    const url = `${BASE_URL}/api/session-comments/trainer/${sessionCommentId}/${trainerId}`;

    try {
        const response = await instance.put(url, { content: comment });
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error(`Error editing comment ${sessionCommentId} for trainer with id ${trainerId}`, error);
        return null;
    }
};