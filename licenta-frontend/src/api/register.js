import {instance} from "./axiosInstance";

const BASE_URL = "https://kidsphere.ddns.net/backend";

export const registerUser = async (user) => {
    const userRole = user.isTrainer ? "trainers" : "parents";
    const registerUrl = `${BASE_URL}/api/${userRole}/register`;
    let response;
    userRole === "trainers" ? response = await registerTrainer(user, registerUrl) : response = await registerParent(user, registerUrl);
    return response;
};

const registerParent = async (parentData, url) => {
    try {
        const response = await instance.post(url, parentData);

        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }

    } catch (error) {
        console.log("error calling register parent endpoint: ", error);
    }
}

const registerTrainer = async (trainerData, url) => {
    const formData = new FormData();

    formData.append("trainer", new Blob([
        JSON.stringify({
            firstName: trainerData.firstName,
            lastName: trainerData.lastName,
            email: trainerData.email,
            phoneNumber: trainerData.phoneNumber,
            description: trainerData.trainerDescription,
            gender: trainerData.gender,
            birthDate: trainerData.birthDate,
        })
    ], { type: "application/json" }));

    if (trainerData.trainerImage) {
        formData.append("image", trainerData.trainerImage);
    }

    try {
        const response = await instance.post(url, formData)

        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.log("error calling register trainer endpoint: ", error);
        return null;
    }
};