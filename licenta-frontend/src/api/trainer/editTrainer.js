import {BASE_URL, instance} from "../axiosInstance";

export const editTrainer = async (trainerData) => {
    const url = `${BASE_URL}/api/trainers/${trainerData.id}`

    const formData = new FormData();

    formData.append("trainer", new Blob([
        JSON.stringify({
            firstName: trainerData.firstName,
            lastName: trainerData.lastName,
            email: trainerData.email,
            phoneNumber: trainerData.phoneNumber,
            description: trainerData.description,
            gender: trainerData.gender,
            birthDate: trainerData.birthDate,
        })
    ], { type: "application/json" }));

    if (trainerData.trainerImage) {
        formData.append("image", trainerData.trainerImage);
    }

    try {
        const response = await instance.put(url, formData)

        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true };
        }
    } catch (error) {
        console.log("error calling edit trainer endpoint: ", error);
        return null;
    }
};