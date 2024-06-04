import { DynamoDBStreamEvent } from "aws-lambda";
import { ResponseBuilder } from "../builders/response_builder";
import { EC2Client } from "@aws-sdk/client-ec2";
import { runScript } from "../services/run_script";

const ec2Client = new EC2Client({ region: process.env.REGION });

export const handler = async (event: DynamoDBStreamEvent) => {
    try {
        for (const record of event.Records) {
            if (record.eventName === "INSERT" && record.dynamodb) {
                const newImage = record.dynamodb.NewImage;
                if (newImage?.id?.S) {
                    await runScript(ec2Client, newImage.id.S);
                } else {
                    throw new Error("No new image or id found");
                }
            } else {
                throw new Error("No event found");
            }
        }

        return new ResponseBuilder().setBody({ message: event }).build();
    } catch (err) {
        return new ResponseBuilder()
            .setStatusCode(500)
            .setBody({ message: err })
            .build();
    }
};
