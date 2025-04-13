import {BASE_URL, instance} from "../axiosInstance";

export const updateChild = async (childId, childData) => {
    const url = `${BASE_URL}/api/children/${childId}`;

    try {
        const response = await instance.put(url, childData);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error updating child with id ${childId}:`, error);
        return null;
    }
};