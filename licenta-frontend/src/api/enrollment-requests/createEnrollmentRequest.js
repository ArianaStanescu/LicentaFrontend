import {BASE_URL, instance} from "../axiosInstance";

export const createEnrollmentRequest = async (adId, childId) => {
    const url = `${BASE_URL}/api/enrollment-requests/create/${adId}/${childId}`;

    try {
        const response = await instance.post(url);
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error creating enrollment request for child ${childId}:`, error);
        return {success: false, error: error?.response?.data?.errorMessage};
    }
};