import {BASE_URL, instance} from "../axiosInstance";

export const hasFavoriteTrainer = async (parentId, trainerId) => {
    const url = `${BASE_URL}/api/parents/has-favorite-trainer/${parentId}/${trainerId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error retrieving has favorite trainer ${trainerId} for parent ${parentId}:`, error);
        return null;
    }
};