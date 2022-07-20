#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { deployClusters } from './cluster-deployment';
import { deployResources } from './resource-deployment';
const yaml = require('js-yaml')

const app = new cdk.App();

// Cluster Deployment
const clusterStackMap = deployClusters(app)


// Resource Deployment
if(process.env.CDK_EKS_RESOURCE_DEPLOY == 'true') {
    deployResources(app, clusterStackMap)
}