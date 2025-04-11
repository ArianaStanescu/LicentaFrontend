import {BASE_URL, instance} from "../axiosInstance";

export const removeFavoriteTrainer = async (parentId, trainerId) => {
    const url = `${BASE_URL}/api/parents/remove-favorite-trainer/${parentId}/${trainerId}`;

    try {
        const response = await instance.delete(url);
        if (response.data.error) {
            return {success: false, error: response.data.error};
        } else {
            return {success: true};
        }
    } catch (error) {
        console.error(`Error deleting favorite trainer ${trainerId} to parent ${parentId}:`, error);
        return null;
    }
};