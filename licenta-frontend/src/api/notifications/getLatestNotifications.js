import {BASE_URL, instance} from "../axiosInstance";

export const getLatestNotifications = async (userId, isTrainer) => {
    const notificationsPath = isTrainer ? "latest-for-trainer" : "latest-for-parent";
    const notificationsUrl = `${BASE_URL}/api/notifications/${notificationsPath}/${userId}`;

    try {
        const response = await instance.get(notificationsUrl);
        return response?.data;
    } catch (error) {
        console.error(`Error retrieving latest notifications: `, error);
        return [];
    }
};