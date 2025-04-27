import {BASE_URL, instance} from "../axiosInstance";

export const removeChildFromGroup = async (childId, groupId) => {
    const url = `${BASE_URL}/api/groups/remove-child/${groupId}/${childId}`;

    try {
        const response = await instance.put(url);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.error(`Error removing child with id ${childId} from group with id ${groupId}:`, error);
        return null;
    }
};