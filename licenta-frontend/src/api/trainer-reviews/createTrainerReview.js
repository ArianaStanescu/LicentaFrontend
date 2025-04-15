import { BASE_URL, instance } from "../axiosInstance";

export const createTrainerReview = async (parentId, trainerId, review) => {
    const url = `${BASE_URL}/api/trainer-reviews/${trainerId}/${parentId}`;

    try {
        const response = await instance.post(url, review);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error(`Error creating review for parent with id ${parentId} for trainer with id ${trainerId}:`, error);
        return null;
    }
};