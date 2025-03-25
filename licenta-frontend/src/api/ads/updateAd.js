import {BASE_URL, instance} from "../axiosInstance";

export const updateAd = async (adId, adData) => {
    const url = `${BASE_URL}/api/ads/${adId}`;

    try {
        const response = await instance.put(url, adData);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error updating ad with id ${adId}:`, error);
        return null;
    }
};