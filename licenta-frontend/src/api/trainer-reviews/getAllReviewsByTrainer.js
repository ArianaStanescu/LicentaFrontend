import { BASE_URL, instance } from "../axiosInstance";

export const getAllReviewsByTrainer = async (trainerId, filters) => {
    const url = `${BASE_URL}/api/trainer-reviews/${trainerId}?pageNumber=${filters.pageNumber}&pageSize=${filters.pageSize}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching reviews for trainer with id ${trainerId}:`, error);
        return null;
    }
};