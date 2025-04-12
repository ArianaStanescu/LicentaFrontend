import { BASE_URL, instance } from "../axiosInstance";

export const getAllCommentsForTrainer = async (trainerId, sessionId, filters) => {
    const url = `${BASE_URL}/api/session-comments/list-by-trainer/${sessionId}/${trainerId}?pageNumber=${filters.pageNumber}&pageSize=${filters.pageSize}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching comments for trainer with id ${trainerId}:`, error);
        return null;
    }
};