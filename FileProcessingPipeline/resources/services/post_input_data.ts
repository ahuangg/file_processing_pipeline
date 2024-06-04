import { PutCommand } from "@aws-sdk/lib-dynamodb";
const { customAlphabet } = require("nanoid");
const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 21);

export const postInputData = async function (ddbClient: any, inputData: any) {
    const id = nanoid();
    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            id: id,
            ...inputData,
        },
    };

    try {
        await ddbClient.send(new PutCommand(params));

        return JSON.stringify({
            id: id,
            message: "Input successfully added to DynamoDB!",
        });
    } catch (err) {
        return JSON.stringify({
            message: err,
        });
    }
};
