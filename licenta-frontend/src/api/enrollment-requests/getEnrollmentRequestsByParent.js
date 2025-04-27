import {BASE_URL, instance} from "../axiosInstance";

export const getEnrollmentRequestsByParent = async (parentId, pageNumber, pageSize) => {
    const url = `${BASE_URL}/api/enrollment-requests/list-by-parent/${parentId}`;

    try {
        const response = await instance.get(url, {
            params: {
                pageNumber,
                pageSize
            }
        });
        return response.data;

    } catch (error) {
        console.error(`Error enrollment-requests for parent ${parentId}:`, error);
        return null;
    }
};