import {BASE_URL, instance} from "./axiosInstance";


export const findByEmail = async (email, isTrainer) => {
    const userRole = isTrainer ? "trainers" : "parents";
    const registerUrl = `${BASE_URL}/api/${userRole}/email/${email}`;

    try{
        const response = await instance.get(registerUrl, email);

        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }

    }catch(error){
        console.log("error calling register endpoint: ", error);
    }
};