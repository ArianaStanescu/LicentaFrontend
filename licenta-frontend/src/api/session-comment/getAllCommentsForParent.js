import { BASE_URL, instance } from "../axiosInstance";

export const getAllCommentsForParent = async (parentId, sessionId, filters) => {
    const url = `${BASE_URL}/api/session-comments/list-by-parent/${sessionId}/${parentId}?pageNumber=${filters.pageNumber}&pageSize=${filters.pageSize}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching comments for parent with id ${parentId}:`, error);
        return null;
    }
};