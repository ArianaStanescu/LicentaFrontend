import {BASE_URL, instance} from "../axiosInstance";

export const getGroup = async (groupId) => {
    const url = `${BASE_URL}/api/groups/${groupId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching group with id ${groupId}:`, error);
        return null;
    }
};