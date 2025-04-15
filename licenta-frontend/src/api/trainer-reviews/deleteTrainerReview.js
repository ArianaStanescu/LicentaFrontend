import { BASE_URL, instance } from "../axiosInstance";

export const deleteTrainerReview = async (trainerReviewId, parentId) => {
    const url = `${BASE_URL}/api/trainer-reviews/${trainerReviewId}/${parentId}`;

    try {
        await instance.delete(url);
    } catch (error) {
        console.error(`Error deleting review with id ${trainerReviewId}:`, error);
        return null;
    }
};