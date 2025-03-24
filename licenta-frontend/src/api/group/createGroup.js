import {BASE_URL, instance} from "../axiosInstance";

export const createGroup = async (activityId, adId) => {
    const url = `${BASE_URL}/api/groups/create/${activityId}/${adId}`;

    try {
        const response = await instance.post(url);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error creating group for ad with id ${adId}:`, error);
        return null;
    }
};