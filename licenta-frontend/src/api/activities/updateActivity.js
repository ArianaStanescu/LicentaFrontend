import {BASE_URL, instance} from "../axiosInstance";

export const updateActivity = async (activityId, activityData) => {
    const url = `${BASE_URL}/api/activities/${activityId}`;

    try {
        const response = await instance.put(url, activityData);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error updating activity with id ${activityId}:`, error);
        return null;
    }
};