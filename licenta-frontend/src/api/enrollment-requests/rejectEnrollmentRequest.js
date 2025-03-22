import {BASE_URL, instance} from "../axiosInstance";

export const rejectEnrollmentRequest = async (requestId) => {
    const url = `${BASE_URL}/api/enrollment-requests/${requestId}`;
    const data = { status: "REJECTED" };

    try {
        const response = await instance.put(url, data);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error rejecting enrollment request with id  ${requestId}:`, error);
        return null;
    }
};