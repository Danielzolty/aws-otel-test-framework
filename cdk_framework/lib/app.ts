import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { deployClusters } from './cluster-deployment';
import { deployResources } from './resource-deployment';
const yaml = require('js-yaml')

const app = new cdk.App();

// cluster deployment
const clusterStackMap = deployClusters(app)

// resource deployment
if(process.env.CDK_EKS_RESOURCE_DEPLOY == 'true') {
    deployResources(app, clusterStackMap)
}