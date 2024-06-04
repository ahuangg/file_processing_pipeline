import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const URL_EXPIRATION_SECONDS = 3600;

export const getSignedURL = async function (s3Client: S3Client) {
    try {
        const randomID = Math.floor(Math.random() * 10000000);
        const Key = `input-${randomID}.txt`;

        const s3Params = {
            Bucket: process.env.BUCKET_NAME,
            Key,
            ContentType: "text/plain",
        };

        const uploadURL = await getSignedUrl(
            s3Client,
            new PutObjectCommand(s3Params),
            {
                expiresIn: URL_EXPIRATION_SECONDS,
            }
        );

        return JSON.stringify({
            uploadURL: uploadURL,
            Key,
        });
    } catch (err) {
        return JSON.stringify({ message: err });
    }
};
