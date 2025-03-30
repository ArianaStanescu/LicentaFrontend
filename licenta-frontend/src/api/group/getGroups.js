import {BASE_URL, instance} from "../axiosInstance";

export const getGroups = async (trainerId) => {
    const url = `${BASE_URL}/api/groups/list-by-trainer/${trainerId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching groups for trainer with id ${trainerId}:`, error);
        return null;
    }
};