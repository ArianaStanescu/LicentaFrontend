import {BASE_URL, instance} from "../axiosInstance";

export const getAllFavoriteTrainers = async (parentId, pageNumber, pageSize) => {
    const url = `${BASE_URL}/api/parents/favorite-trainers/${parentId}`;

    try {
        const response = await instance.get(url, {
            params: {
                pageNumber,
                pageSize
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching favorite trainers for parent with id ${parentId}:`, error);
        return null;
    }
};