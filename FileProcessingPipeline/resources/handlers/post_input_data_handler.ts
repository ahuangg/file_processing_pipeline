import { APIGatewayProxyEvent } from "aws-lambda";
import { postInputData } from "../services/post_input_data";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ResponseBuilder } from "../builders/response_builder";
import { InputBuilder } from "../builders/input_builder";

const ddbClient = new DynamoDBClient({ region: process.env.REGION });

export const handler = async (event: APIGatewayProxyEvent) => {
    try {
        const query_params = event.queryStringParameters;

        if (
            query_params &&
            query_params["input_text"] &&
            query_params["input_file_path"]
        ) {
            const inputData = new InputBuilder()
                .addInput("input_text", query_params["input_text"])
                .addInput(
                    "input_file_path",
                    `${process.env.BUCKET_NAME}/${query_params["input_file_path"]}`
                )
                .build();

            await postInputData(ddbClient, inputData);
        } else {
            throw new Error("Query parameters not provided");
        }

        return new ResponseBuilder()
            .setBody({ message: "Input successfully added to DynamoDB!" })
            .build();
    } catch (err) {
        return new ResponseBuilder()
            .setStatusCode(500)
            .setBody({ message: err })
            .build();
    }
};
