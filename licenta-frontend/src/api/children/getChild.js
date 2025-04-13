import {BASE_URL, instance} from "../axiosInstance";

export const getChild = async (childId) => {
    const url = `${BASE_URL}/api/children/${childId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching child with id ${childId}:`, error);
        return null;
    }
};