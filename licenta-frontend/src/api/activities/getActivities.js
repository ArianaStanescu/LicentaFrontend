import {BASE_URL, instance} from "../axiosInstance";

export const getActivities = async (trainerId) => {
    const url = `${BASE_URL}/api/activities/list/${trainerId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching activities for trainer with id ${trainerId}:`, error);
        return null;
    }
};