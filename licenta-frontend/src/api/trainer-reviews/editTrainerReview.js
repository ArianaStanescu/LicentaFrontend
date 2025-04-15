import {BASE_URL, instance} from "../axiosInstance";

export const editTrainerReview = async (parentId, reviewId, review) => {
    const url = `${BASE_URL}/api/trainer-reviews/${reviewId}/${parentId}`;

    try {
        const response = await instance.put(url, review);
        if (response.data.error) {
            return {success: false, error: response.data.error};
        } else {
            return {success: true};
        }
    } catch (error) {
        console.error(`Error editing review ${reviewId} for trainer with id ${parentId}`, error);
        return null;
    }
};