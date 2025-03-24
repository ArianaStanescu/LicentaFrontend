import {BASE_URL, instance} from "../axiosInstance";

export const createActivity = async (trainerId, activityData) => {
    const url = `${BASE_URL}/api/activities/create/${trainerId}`;

    try {
        const response = await instance.post(url, activityData);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error creating activity for trainer with id ${trainerId}:`, error);
        return null;
    }
};