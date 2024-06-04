import {
    RunInstancesCommand,
    _InstanceType,
    DescribeSecurityGroupsCommand,
} from "@aws-sdk/client-ec2";

export const runScript = async (ec2Client: any, itemId: string) => {
    try {
        const userDataScript = `#!/bin/bash
        yum update -y
        yum install -y httpd
        systemctl start httpd
        systemctl enable httpd
        sudo su
        touch ~/.bashrc
        EC2_INSTANCE_ID=$(ec2-metadata -i | awk -F': ' '{print $2}')
        aws s3 cp s3://${process.env.BUCKET_NAME}/${process.env.KEY} script.js
        aws s3 cp s3://${process.env.BUCKET_NAME}/package.json package.json
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
        source ~/.bashrc
        nvm install --lts
        npm i
        node script.js ${process.env.REGION} ${process.env.INPUT_TABLE_NAME} ${process.env.OUTPUT_TABLE_NAME} ${itemId}
        wait
        aws ec2 terminate-instances --instance-ids $EC2_INSTANCE_ID`;

        const userData = Buffer.from(userDataScript).toString("base64");

        const securityGroupsResponse = await ec2Client.send(
            new DescribeSecurityGroupsCommand({})
        );
        const securityGroupIds = securityGroupsResponse.SecurityGroups.map(
            (group: any) => group.GroupId
        );

        const instanceParams = {
            ImageId: "ami-051f8a213df8bc089",
            InstanceType: _InstanceType.t2_micro,
            KeyName: "1",
            MinCount: 1,
            MaxCount: 1,
            SecurityGroupIds: securityGroupIds,
            IamInstanceProfile: {
                Arn: process.env.PROFILE_ARN,
            },
            AssociatePublicIpAddress: true,
            UserData: userData,
        };

        await ec2Client.send(new RunInstancesCommand(instanceParams));

        return JSON.stringify({
            message: "Script ran successfully!",
        });
    } catch (err) {
        return JSON.stringify({
            message: err,
        });
    }
};
