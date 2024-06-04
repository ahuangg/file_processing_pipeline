import { Construct } from "constructs";
import {
    AttributeType,
    BillingMode,
    Table,
    StreamViewType,
} from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";

interface DynamoProps {
    name: string;
}

export class DynamoConstruct extends Construct {
    public readonly table: Table;

    constructor(scope: Construct, id: string, props: DynamoProps) {
        super(scope, id);

        this.table = new Table(this, `Table`, {
            tableName: props.name,
            partitionKey: {
                name: "id",
                type: AttributeType.STRING,
            },
            removalPolicy: RemovalPolicy.DESTROY,
            billingMode: BillingMode.PAY_PER_REQUEST,
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
        });
    }

    public getTable(): Table {
        return this.table;
    }
}
