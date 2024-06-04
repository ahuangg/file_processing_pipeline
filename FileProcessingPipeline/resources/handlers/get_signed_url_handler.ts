import { APIGatewayProxyEvent } from "aws-lambda";
import { getSignedURL } from "../services/get_signed_url";
import { S3Client } from "@aws-sdk/client-s3";
import { ResponseBuilder } from "../builders/response_builder";

const s3Client = new S3Client({region:process.env.REGION});

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        return new ResponseBuilder()
            .setBody(await getSignedURL(s3Client))
            .build();
    } catch (err) {
        return new ResponseBuilder()
            .setStatusCode(500)
            .setBody({ message: err })
            .build();
    }
};
