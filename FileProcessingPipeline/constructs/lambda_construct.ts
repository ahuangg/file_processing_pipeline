import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export interface LambdaProps {
    handler: string;
    environment: { key?: string } | undefined;
}

export class LambdaConstruct extends Construct {
    public readonly lambda: NodejsFunction;

    constructor(scope: Construct, id: string, props: LambdaProps) {
        super(scope, id);

        this.lambda = new NodejsFunction(this, `Lambda`, {
            runtime: Runtime.NODEJS_20_X,
            handler: "handler",
            entry: `resources/handlers/${props.handler}.ts`,
            environment: props.environment,
        });
    }

    public getLambda = (): NodejsFunction => {
        return this.lambda;
    };
}
