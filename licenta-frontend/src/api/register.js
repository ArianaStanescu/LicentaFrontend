import {instance} from "./axiosInstance";

const BASE_URL = "http://localhost:8080";

export const registerUser = async (user) => {
    const userRole = user.isTrainer ? "trainers" : "parents";
    const registerUrl = `${BASE_URL}/api/${userRole}/register`;

    try{
        const response = await instance.post(registerUrl, user);

        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }

    }catch(error){
        console.log("error calling register endpoint: ", error);
    }
};