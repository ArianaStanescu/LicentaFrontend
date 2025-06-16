import {BASE_URL, instance} from "../axiosInstance";

export const getActiveActivitesNames = async () => {
    const url = `${BASE_URL}/api/activities/list-active-names`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching active activities names`, error);
        return null;
    }
};