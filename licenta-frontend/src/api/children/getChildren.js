import {BASE_URL, instance} from "../axiosInstance";

export const getChildren = async (parentId) => {
    const url = `${BASE_URL}/api/children/list/${parentId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching children for parent with id ${parentId}:`, error);
        return null;
    }
};