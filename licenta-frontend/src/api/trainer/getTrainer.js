import {BASE_URL, instance} from "../axiosInstance";

export const getTrainer = async (trainerId) => {
    const url = `${BASE_URL}/api/trainers/${trainerId}`;

    try {
        const response = await instance.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching trainer with id ${trainerId}:`, error);
        return null;
    }
};