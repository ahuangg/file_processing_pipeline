import {
    DynamoDBClient,
    GetItemCommand,
    PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
    GetObjectCommand,
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import { marshall } from "@aws-sdk/util-dynamodb";
import fs from "fs";
import util from "util";
const appendFile = util.promisify(fs.appendFile);
import { customAlphabet } from "nanoid";
const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet, 21);

const main = async () => {
    const args = process.argv.slice(2);

    if (args.length !== 4) {
        console.error(
            "Usage: node script.js <region> <input-table-name> <output-table-name> <item-id> "
        );
        return;
    }

    try {
        const [region, inputTableName, outputTableName, itemId] = args;

        const s3Client = new S3Client({ region });
        const ddbClient = new DynamoDBClient({ region });

        const tableItem = await getItemById(ddbClient, inputTableName, itemId);

        const [bucketName, tempFilePath] = await processItem(
            s3Client,
            tableItem
        );

        await putFileInBucket(s3Client, bucketName, tempFilePath);
        await putOutputPathInTable(
            ddbClient,
            outputTableName,
            bucketName,
            tempFilePath
        );
    } catch (err) {
        console.error(err);
    }
};

const getItemById = async (ddbClient, tableName, itemId) => {
    const params = {
        TableName: tableName,
        Key: marshall({
            id: itemId,
        }),
    };

    const response = await ddbClient.send(new GetItemCommand(params));
    return response.Item;
};

const processItem = async (s3Client, tableItem) => {
    const inputText = tableItem.input_text.S;
    const filePath = tableItem.input_file_path.S;
    const bucketParts = filePath.split("/");
    const key = bucketParts.pop();
    const bucketName = bucketParts.join("/");

    const fileStream = await downloadFromBucket(s3Client, bucketName, key);
    const randomId = Math.floor(Math.random() * 10000000);
    const tempFilePath = `output-${randomId}.txt`;

    await streamToFile(fileStream, tempFilePath);
    await appendFile(tempFilePath, ` : ${inputText}`);

    return [bucketName, tempFilePath];
};

const streamToFile = async (Body, filePath) => {
    await new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        Body.pipe(fileStream);
        Body.on("error", reject);
        fileStream.on("finish", resolve);
    });
};

const downloadFromBucket = async (s3Client, bucketName, key) => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };
    const { Body } = await s3Client.send(new GetObjectCommand(params));
    return Body;
};

const putFileInBucket = async (s3Client, bucketName, key) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fs.createReadStream(key),
    };

    await s3Client.send(new PutObjectCommand(params));
};

const putOutputPathInTable = async (
    ddbClient,
    tableName,
    bucketName,
    filePath
) => {
    const id = nanoid();
    const params = {
        TableName: tableName,
        Item: marshall({
            id: id,
            output_file_path: `${bucketName}/${filePath}`,
        }),
    };

    await ddbClient.send(new PutItemCommand(params));
};

main();
