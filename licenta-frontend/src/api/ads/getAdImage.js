import {BASE_URL, instance} from "../axiosInstance";

export const getAdImage = async (adId) => {
    const url = `${BASE_URL}/api/ad-images/${adId}`;

    try {
        const response = await instance.get(url, { responseType: "blob" });
        return URL.createObjectURL(response.data);
    } catch (error) {
        console.error(`Error fetching image for ad ${adId}:`, error);
        return null;
    }
};
