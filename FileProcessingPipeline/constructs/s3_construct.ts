import { Construct } from "constructs";
import {
    Bucket,
    CorsRule,
    HttpMethods,
    BlockPublicAccess,
} from "aws-cdk-lib/aws-s3";
import { PolicyStatement, AnyPrincipal } from "aws-cdk-lib/aws-iam";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { getDir } from "../utils/get_script_dir";

export class S3Construct extends Construct {
    private readonly bucket: Bucket;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.bucket = new Bucket(this, `Bucket`, {
            blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        });

        this.setupBucket();
    }

    private setupBucket(): void {
        this.addCorsRule();
        this.addBucketPolicy();
        this.deployAssets();
    }

    private addCorsRule(): void {
        const corsRule: CorsRule = {
            allowedMethods: [
                HttpMethods.GET,
                HttpMethods.POST,
                HttpMethods.PUT,
            ],
            allowedOrigins: ["*"],
            allowedHeaders: ["*"],
            maxAge: 3000,
        };

        this.bucket.addCorsRule(corsRule);
    }

    private addBucketPolicy(): void {
        const policyStatement = new PolicyStatement({
            actions: ["s3:*"],
            principals: [new AnyPrincipal()],
            resources: [this.bucket.bucketArn, `${this.bucket.bucketArn}/*`],
        });

        this.bucket.addToResourcePolicy(policyStatement);
    }

    private deployAssets(): void {
        new BucketDeployment(this, "ScriptAssetDeployment", {
            sources: [Source.asset(getDir())],
            destinationBucket: this.bucket,
        });
    }

    public getBucket(): Bucket {
        return this.bucket;
    }
}
