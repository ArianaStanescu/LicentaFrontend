import {BASE_URL, instance} from "../axiosInstance";

export const getAd = async (id) => {
    const url = `${BASE_URL}/api/ads/${id}`;

    try {
        const response = await instance.get(url);;
        return response.data;
    } catch (error) {
        console.error(`Error fetching ad with id ${id}:`, error);
        return null;
    }
};