#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { FileProcessingPipelineCDKStack } from "../lib/ile_processing_pipeline_cdk-stack";
import { AmplifyStack } from "../lib/amplify-stack";

const app = new cdk.App();

const backendStack = new FileProcessingPipelineCDKstack(
    app,
    "FileProcessingPipelineCDK",
    {}
);

new AmplifyStack(app, "AmplifyStack", backendStack.api.url, {});
