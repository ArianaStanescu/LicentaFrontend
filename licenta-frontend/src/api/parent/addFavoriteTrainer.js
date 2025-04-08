import {BASE_URL, instance} from "../axiosInstance";

export const addFavoriteTrainer = async (parentId, trainerId) => {
    const url = `${BASE_URL}/api/parents/add-favorite-trainer/${parentId}/${trainerId}`;

    try {
        const response = await instance.post(url);
        if (response.data.error) {
            return {success: false, error: response.data.error};
        } else {
            return {success: true};
        }
    } catch (error) {
        console.error(`Error adding favorite trainer ${trainerId} to parent ${parentId}:`, error);
        return null;
    }
};