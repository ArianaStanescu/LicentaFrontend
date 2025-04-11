import { BASE_URL, instance } from "../axiosInstance";

export const getDocumentContent = async (sessionId, title = "document") => {
    const url = `${BASE_URL}/api/session-documents/download/${sessionId}`;

    try {
        const response = await instance.get(url, {
            responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const blobUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = `${title}.pdf`;

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error(`Eroare la descărcarea documentului pentru sesiunea ${sessionId}:`, error);
    }
};
