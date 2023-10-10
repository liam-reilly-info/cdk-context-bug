#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkContextBugStack } from '../lib/cdk-context-bug-stack';

const app = new cdk.App();
new CdkContextBugStack(app, 'CdkContextBugStack', {
    env: {
        account: "",
        region: ""
    },
    vpcId: ""
});