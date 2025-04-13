import {BASE_URL, instance} from "../axiosInstance";

export const getGroupsByChild= async (childId) => {
    const url = `${BASE_URL}/api/groups/list-by-child/${childId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching groups for child with id ${childId}:`, error);
        return null;
    }
};