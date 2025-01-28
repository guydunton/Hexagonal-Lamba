#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LambdaStack } from './lambda-stack';

const app = new cdk.App();

new LambdaStack(app, 'GuyTestLambdaStack', {
  env: { account: '321379454723', region: 'eu-west-1' },
});
