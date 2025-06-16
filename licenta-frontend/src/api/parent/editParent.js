import {BASE_URL, instance} from "../axiosInstance";

export const editParent = async (parentId, parentData) => {
    const url = `${BASE_URL}/api/parents/${parentId}`;

    try {
        const response = await instance.put(url, parentData);
        return response.data;
    } catch (error) {
        console.error(`Error updating parent with id ${parentId}:`, error);
        return null;
    }
};