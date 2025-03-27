import {BASE_URL, instance} from "../axiosInstance";

export const getGroupsByActivity = async (activityId) => {
    const url = `${BASE_URL}/api/groups/list-by-activity/${activityId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching groups for activity with id ${activityId}:`, error);
        return null;
    }
};