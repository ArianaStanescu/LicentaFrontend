import {BASE_URL, instance} from "../axiosInstance";

export const searchByTrainerId = async (trainerId, params) => {
    const searchURL = `${BASE_URL}/api/ads/search-by-trainer/${trainerId}`;

    try {
        const response = await instance.get(searchURL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching ads:", error);
        return null;
    }
};