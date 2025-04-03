import {BASE_URL, instance} from "../axiosInstance";

export const markNotificationsAsSeen = async (notificationIds) => {
    const notificationsUrl = `${BASE_URL}/api/notifications/mark-as-seen`;

    try {
        const response = await instance.put(notificationsUrl, {
            notificationIds
        });
        return response?.data;
    } catch (error) {
        console.error(`Error mark as seen notifications`, error);
        return null;
    }
};