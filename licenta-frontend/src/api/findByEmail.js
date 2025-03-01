import {BASE_URL, instance} from "./axiosInstance";


export const findByEmail = async (email, isTrainer) => {
    const userRole = isTrainer ? "trainers" : "parents";
    const registerUrl = `${BASE_URL}/api/${userRole}/email/${email}`;

    try {
        const response = await instance.get(registerUrl, email);
        return response?.data?.id;
    } catch (error) {
        return null;
    }
};