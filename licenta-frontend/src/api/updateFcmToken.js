import {instance} from "./axiosInstance";

const BASE_URL = "https://kidsphere.ddns.net/backend";

export const updateFcmToken = async (userId, isTrainer, fcmToken) => {
    const userRole = isTrainer ? "trainers" : "parents";
    const updateTokenUrl = `${BASE_URL}/api/${userRole}/update-fcm-token/${userId}`;

    try {
        const response = await instance.put(updateTokenUrl, {"fcmToken": fcmToken});

        if (response.data.error) {
            return {success: false, error: response.data.error};
        } else {
            return {success: true};
        }

    } catch (error) {
        console.log("error calling update fcm token endpoint: ", error);
    }
};