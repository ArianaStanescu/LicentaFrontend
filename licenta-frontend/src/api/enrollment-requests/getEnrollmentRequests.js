import {BASE_URL, instance} from "../axiosInstance";

export const getEnrollmentRequests = async (adId) => {
    const url = `${BASE_URL}/api/enrollment-requests/list-by-ad/${adId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error enrollment-requests for ad ${adId}:`, error);
        return null;
    }
};