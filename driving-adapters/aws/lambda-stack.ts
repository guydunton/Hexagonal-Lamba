import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as njs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const elevenLabsSecret = secrets.Secret.fromSecretNameV2(
      this,
      'elevenlabs-secret',
      'eleven-labs-api-key',
    );

    const cp2ApiKey = secrets.Secret.fromSecretNameV2(
      this,
      'cp2-secret',
      'guy-test-hexagonal-lambda/cp2-key',
    );

    const bucketName = 'guy-test-eleven-labs';
    const bucket = s3.Bucket.fromBucketName(this, 'bucket', bucketName);

    const lambda = new njs.NodejsFunction(this, 'handler', {
      environment: {
        ELEVENLABS_API_KEY: elevenLabsSecret.secretValue.toString(),
        CP2_USERNAME: cp2ApiKey.secretValueFromJson('username').toString(),
        CP2_PASSWORD: cp2ApiKey.secretValueFromJson('password').toString(),
        BUCKET_NAME: bucketName,
      },
      timeout: cdk.Duration.minutes(5),
    });

    // Get the bucket

    bucket.grantPut(lambda);
  }
}
