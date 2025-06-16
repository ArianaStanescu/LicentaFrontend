import {BASE_URL, instance} from "../axiosInstance";

export const getParent = async (parentId) => {
    const url = `${BASE_URL}/api/parents/${parentId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching parent with id ${parentId}:`, error);
        return null;
    }
};