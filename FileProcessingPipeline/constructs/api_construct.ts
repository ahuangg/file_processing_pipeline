import { Construct } from "constructs";
import { ApiKeySourceType, Cors, RestApi } from "aws-cdk-lib/aws-apigateway";

export class ApiConstruct extends Construct {
    public readonly api: RestApi;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.api = new RestApi(this, `Api`, {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                allowHeaders: [
                    "Content-Type",
                    "X-Amz-Date",
                    "Authorization",
                    "X-Api-Key",
                ],
                allowCredentials: true,
            },
            apiKeySourceType: ApiKeySourceType.HEADER,
        });
    }

    public getApi = (): RestApi => {
        return this.api;
    };
}
