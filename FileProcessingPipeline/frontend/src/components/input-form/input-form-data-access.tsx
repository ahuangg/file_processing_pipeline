import axios from "axios";
import { URI_MAPPING } from "constant/const-strings";

export const getSignedURL = async (): Promise<
    { uploadURL: string; Key: string } | undefined
> => {
    try {
        const result = await axios.get(
            `${process.env.REACT_APP_ENDPOINT}/${URI_MAPPING.getSignedURL}`
        );
        return JSON.parse(result.data);
    } catch (err) {
        console.error("Error fetching S3 URL:", err);
        return undefined;
    }
};

export const putFileInS3 = async (url: string, file: File): Promise<void> => {
    try {
        await axios.put(url, file, {
            headers: {
                "Content-Type": file.type,
            },
        });
    } catch (error) {
        console.error("Error uploading file to S3:", error);
    }
};

export const postInputData = async (
    inputText: string,
    key: string
): Promise<void> => {
    try {
        const queryString = new URLSearchParams({
            input_text: inputText,
            input_file_path: key,
        }).toString();

        await axios.post(
            `${process.env.REACT_APP_ENDPOINT}/${URI_MAPPING.postInputData}?${queryString}`
        );
    } catch (error) {
        console.error("Error posting input to DynamoDB:", error);
    }
};
