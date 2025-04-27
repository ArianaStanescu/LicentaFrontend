import {BASE_URL, instance} from "../axiosInstance";

export const getTrainerImage = async (trainerId) => {
    const url = `${BASE_URL}/api/trainer-images/${trainerId}`;

    try {
        const response = await instance.get(url, { responseType: "blob" });
        return URL.createObjectURL(response.data);
    } catch (error) {
        console.error(`Error fetching trainer image for trainer with id ${trainerId}:`, error);
        return null;
    }
};