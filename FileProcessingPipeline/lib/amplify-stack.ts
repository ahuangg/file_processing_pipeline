import { Construct } from "constructs";
import { Stack, StackProps } from "aws-cdk-lib";
import { App, GitHubSourceCodeProvider } from "@aws-cdk/aws-amplify-alpha";
import { SecretValue } from "aws-cdk-lib";
import { BuildSpec } from "aws-cdk-lib/aws-codebuild";

export class AmplifyStack extends Stack {
    public readonly app: App;

    constructor(
        scope: Construct,
        id: string,
        endpoint: string,
        props: StackProps
    ) {
        super(scope, id);

        this.app = new App(this, `Amplify-App`, {
            environmentVariables: {
                AMPLIFY_MONOREPO_APP_ROOT: "FileProcessingPipelineCDK/frontend",
                REACT_APP_ENDPOINT: endpoint,
            },
            sourceCodeProvider: new GitHubSourceCodeProvider({
                owner: "ahuangg",
                repository: "FileProcessingPipeline",
                oauthToken: SecretValue.secretsManager("github-token"),
            }),
            buildSpec: BuildSpec.fromObject({
                version: "1.0",
                applications: [
                    {
                        appRoot: "FileProcessingPipelineCDK/frontend",
                        frontend: {
                            phases: {
                                preBuild: {
                                    commands: ["npm i"],
                                },
                                build: {
                                    commands: ["npm run build"],
                                },
                            },
                            artifacts: {
                                baseDirectory: "build",
                                files: ["**/*"],
                            },
                            cache: {
                                paths: ["node_modules/**/*"],
                            },
                        },
                    },
                ],
            }),
        });

        this.app.addBranch("main");
    }
}
