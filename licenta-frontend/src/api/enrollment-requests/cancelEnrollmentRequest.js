import {BASE_URL, instance} from "../axiosInstance";

export const cancelEnrollmentRequest = async (requestId) => {
    const url = `${BASE_URL}/api/enrollment-requests/${requestId}`;
    const data = { status: "CANCELED" };

    try {
        const response = await instance.put(url, data);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error canceling enrollment request with id  ${requestId}:`, error);
        return null;
    }
};