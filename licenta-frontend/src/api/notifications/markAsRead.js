import {BASE_URL, instance} from "../axiosInstance";

export const markNotificationAsRead = async (notificationId) => {
    const notificationsUrl = `${BASE_URL}/api/notifications/mark-as-read/${notificationId}`;

    try {
        const response = await instance.get(notificationsUrl);
        return response?.data;
    } catch (error) {
        console.error(`Error mark as read notification with id ${notificationId}:`, error);
        return null;
    }
};