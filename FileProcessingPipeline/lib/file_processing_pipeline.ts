import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import { ApiConstruct } from "../constructs/api_construct";
import { DynamoConstruct } from "../constructs/dynamo_contruct";
import { S3Construct } from "../constructs/s3_construct";
import { LambdaConstruct } from "../constructs/lambda_construct";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import {
    InstanceProfile,
    ManagedPolicy,
    Role,
    ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { REGION } from "../utils/constants";

interface LambdaConfig {
    name: string;
    handler: string;
    resource?: string;
    environment: { [key: string]: string | Role };
    method?: "GET" | "POST";
    tablePermissions: boolean;
    ec2Permissions: boolean;
}

export class FileProcessingPipelineCdkStack extends Stack {
    public readonly api: RestApi;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        this.api = new ApiConstruct(this, "FileProcessingPipelineCdkStack").getApi();

        const inputTable = new DynamoConstruct(this, "InputFile", {
            name: "InputFilesTable",
        }).getTable();

        const outputTable = new DynamoConstruct(this, "OutputFile", {
            name: "OutputFilesTable",
        }).getTable();

        const fileBucket = new S3Construct(this, "File").getBucket();

        const ec2Role = this.createEC2Role();
        const ec2InstanceProfile = new InstanceProfile(
            this,
            "EC2InstanceProfile",
            { role: ec2Role }
        );

        const lambdaConfigs: LambdaConfig[] = [
            {
                name: "GetSignedUrl",
                handler: "get_signed_url_handler",
                resource: "getSignedURL",
                environment: {
                    BUCKET_NAME: fileBucket.bucketName,
                    REGION: REGION,
                },
                method: "GET",
                tablePermissions: false,
                ec2Permissions: false,
            },
            {
                name: "PostInputData",
                handler: "post_input_data_handler",
                resource: "postInputData",
                environment: {
                    TABLE_NAME: inputTable.tableName,
                    BUCKET_NAME: fileBucket.bucketName,
                    REGION: REGION,
                },
                method: "POST",
                tablePermissions: true,
                ec2Permissions: false,
            },
            {
                name: "RunScript",
                handler: "run_script_handler",
                environment: {
                    INPUT_TABLE_NAME: inputTable.tableName,
                    OUTPUT_TABLE_NAME: outputTable.tableName,
                    BUCKET_NAME: fileBucket.bucketName,
                    REGION: REGION,
                    KEY: "script.js",
                    PROFILE_ARN: ec2InstanceProfile.instanceProfileArn,
                },
                tablePermissions: true,
                ec2Permissions: true,
            },
        ];

        this.createLambdaResources(
            this.api,
            inputTable,
            lambdaConfigs,
            outputTable
        );
    }

    private createEC2Role(): Role {
        const ec2Role = new Role(this, "EC2Role", {
            assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
        });

        const managedPolicies = [
            "AmazonEC2FullAccess",
            "AmazonS3FullAccess",
            "AmazonDynamoDBFullAccess",
            "IAMFullAccess",
        ];

        managedPolicies.forEach((policyName) => {
            ec2Role.addManagedPolicy(
                ManagedPolicy.fromAwsManagedPolicyName(policyName)
            );
        });

        return ec2Role;
    }

    private createLambdaResources(
        api: RestApi,
        fileTable: Table,
        lambdaConfigs: LambdaConfig[],
        fileTable2?: Table
    ) {
        for (const config of lambdaConfigs) {
            const lambda = new LambdaConstruct(this, config.name, {
                handler: config.handler,
                environment: config.environment,
            }).getLambda();

            if (config.method && config.resource) {
                const integration = new LambdaIntegration(lambda);
                const uploadResource = api.root.addResource(config.resource);
                uploadResource.addMethod(config.method, integration);
            }

            if (config.tablePermissions) {
                fileTable.grantReadWriteData(lambda);
            }

            if (config.ec2Permissions) {
                fileTable.grantStreamRead(lambda);
                fileTable.grantTableListStreams(lambda);

                fileTable2?.grantReadWriteData(lambda);

                lambda.role?.addManagedPolicy(
                    ManagedPolicy.fromAwsManagedPolicyName(
                        "AmazonEC2FullAccess"
                    )
                );

                lambda.role?.addManagedPolicy(
                    ManagedPolicy.fromAwsManagedPolicyName("IAMFullAccess")
                );

                lambda.addEventSource(
                    new DynamoEventSource(fileTable, {
                        startingPosition: StartingPosition.LATEST,
                    })
                );
            }
        }
    }
}
