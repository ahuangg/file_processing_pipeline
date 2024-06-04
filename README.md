# File Processing Pipeline

## Overview

Secure and scalable file processing pipeline built with React and AWS. Users interact with the frontend by providing a text input and upload file. Upload files directly goes to Amazon S3 by a presigned URL. User input and s3 file path are then stored in a DynamoDB table for tracking. DynamoDB triggers a lambda when an item is put in the table that launches a temporary EC2 instance. This instance runs a script that retrieves the input and file from DynamoDB, appends the input text to the file, uploads new file to s3, stores path in DynamoDB.

## System Architecture

![system](https://github.com/ahuangg/file_processing_pipeline/assets/98438095/09f94173-8fb1-4f69-bc7c-0a121b8b9c42)


## Requirements

The following **required** functionality is completed:

-   [x] Responsive UI with text and file input
-   [x] Upload input file to S3 directly from browser
-   [x] Save inputs and S3 path DynamoDB FileTable via API gateway and Lambda function
-   [x] Trigger a script to run a VM instance via DynamoEvent

The following **aditional** features are implemented:

-   [ ] Use AWS Cognito as API gateway authorizer
-   [x] Frontend is host in Amplify
-   [x] Use Flowbitecss and ReactJs for responsive UI

## Getting Started

**prerequisites**

-   [NodeJS 20](https://nodejs.org/en/download)
-   [AWS account](https://aws.amazon.com/)
-   [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
-   [AWS CDk ToolKit](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**aws environment**

-   use the following [link](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_bootstrap) to set up programmatic access and bootstrap environment for AWS
-   set up secrets with name as "github-token" with secrets manager for github with this [link](https://docker.awsworkshop.io/41_codepipeline/10_setup_secretsmanager_github.html)

**dev environment**

-   clone github repository
    ```
    git clone git@github.com:ahuangg/file_processing_pipeline.git
    ```
-   install dependencies

    ```
    cd FileProcessingPipeline
    npm install
    ```

-   deploy cdk
    ```
    cdk synth --all
    cdk bootstrap --all
    cdk deplloy --all
    ```

**live application**

-   visit [amplify](https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/) in aws console
-   if app does not build automatically click run build  
-   open link provided by Amplify after app is deployed

## Preview

<div>
    <a href="https://www.loom.com/share/4cced20b15a1430f9a188e4a0f0cdf0e">
      <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/4cced20b15a1430f9a188e4a0f0cdf0e-with-play.gif">
    </a>
  </div>
  
## Reference
**api gateway**  
- [https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway-readme.html](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway-readme.html)
- [https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-gatewayResponse-definition.html](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-gatewayResponse-definition.html)
- [https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-tutorial.html](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-tutorial.html)

**lambda**

-   [https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)
-   [https://github.com/awsdocs/aws-lambda-developer-guide/tree/main](https://github.com/awsdocs/aws-lambda-developer-guide/tree/main)
-   [https://gist.github.com/lrakai/18303e1fc1fb1d8635cc20eee73a06a0](https://gist.github.com/lrakai/18303e1fc1fb1d8635cc20eee73a06a0)

**s3**

-   [https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html)
-   [https://github.com/aws-samples/amazon-s3-presigned-urls-aws-sam/blob/master/getSignedURL/app.js](https://github.com/aws-samples/amazon-s3-presigned-urls-aws-sam/blob/master/getSignedURL/app.js)
-   [https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/)

**dynamodb**

-   [https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-util-dynamodb/#convert-dynamodb-record-into-javascript-object](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-util-dynamodb/#convert-dynamodb-record-into-javascript-object)
-   [https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-util-dynamodb/#convert-dynamodb-record-into-javascript-object](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-util-dynamodb/#convert-dynamodb-record-into-javascript-object)
-   [https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_event_sources.DynamoEventSource.html](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda_event_sources.DynamoEventSource.html)

**ec2**

-   [https://stackoverflow.com/questions/70522650/how-to-invoke-a-new-ec2-instance-with-existing-iam-role-javascript-aws-sdk-v3](https://stackoverflow.com/questions/70522650/how-to-invoke-a-new-ec2-instance-with-existing-iam-role-javascript-aws-sdk-v3)
-   [https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ec2/command/DescribeInstanceStatusCommand/](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ec2/command/DescribeInstanceStatusCommand/)
-   [https://stackoverflow.com/questions/67774483/ec2-userdata-script-is-not-running-on-startup](https://stackoverflow.com/questions/67774483/ec2-userdata-script-is-not-running-on-startup)
-   [https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ec2/actions](https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ec2/actions)
