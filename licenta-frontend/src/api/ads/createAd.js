import {BASE_URL, instance} from "../axiosInstance";

export const createAd = async (activityId, adData) => {
    const url = `${BASE_URL}/api/ads/create/${activityId}`;
    const formData = new FormData();

    formData.append("ad", new Blob([
        JSON.stringify({
            price: adData.price,
            minAge: adData.minAge,
            maxAge: adData.maxAge,
            totalSpots: adData.totalSpots,
            startDate: adData.startDate,
            endDate: adData.endDate,
            durationRules: adData.durationRules,
            location: adData.location,
        })
    ], { type: "application/json" }));

    if (adData.image) {
        formData.append("image", adData.image);
    }

    try {
        const response = await instance.post(url, formData)

        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true};
        }
    } catch (error) {
        console.error(`Error creating ad for activity with id ${activityId}:`, error);
        return null;
    }
};