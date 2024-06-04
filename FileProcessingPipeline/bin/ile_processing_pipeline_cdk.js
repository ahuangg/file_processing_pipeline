#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const file_processing_pipeline_cdk_stack_1 = require("../lib/file-processing-pipeline-stack");
const app = new cdk.App();
new file_processing_pipeline_cdk_stack_1.FileProcessingPipelineCDKStack(
    app,
    "FileProcessingPipelineCDKStack",
    {}
);
