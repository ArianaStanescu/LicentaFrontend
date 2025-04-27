import {BASE_URL, instance} from "../axiosInstance";

export const editGroup = async (groupId, group) => {
    const url = `${BASE_URL}/api/groups/update/${groupId}`;

    try {
        const response = await instance.put(url, group);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error(`Error updating group with id ${groupId}:`, error);
        return null;
    }
};