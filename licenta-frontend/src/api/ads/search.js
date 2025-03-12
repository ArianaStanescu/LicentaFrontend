import {BASE_URL, instance} from "../axiosInstance";

export const search = async (params) => {
    const searchURL = `${BASE_URL}/api/ads/search`;

    try {
        const response = await instance.get(searchURL, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching ads:", error);
        return null;
    }
};