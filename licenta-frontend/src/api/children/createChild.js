import {BASE_URL, instance} from "../axiosInstance";

export const createChild = async (parentId, childData) => {
    const url = `${BASE_URL}/api/children/create/${parentId}`;

    try {
        const response = await instance.post(url, childData);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error fetching children for parent with id ${parentId}:`, error);
        return null;
    }
};