import { instance } from "../axiosInstance";

export const sendResponse = async (input, previous_response_id) => {
    const url = `https://api.openai.com/v1/responses`;
    const bearer = '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';

    try {
        const response = await instance.post(url, {
            "model": "gpt-4o",
            "input": input,
            "previous_response_id": previous_response_id,
            "store": true
        },
            {
                headers: {
                    Authorization: `Bearer ${bearer}`,
                }
            });
        if (response.data.error) {
            return { success: false, error: response.data.error };
        } else {
            return { success: true, data: response.data };
        }
    } catch (error) {
        console.error(`Error communicating with chatbot!`, error);
        return null;
    }
};