import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClusterStack } from './stacks/cluster-stack';
import { validateTestcaseConfig } from './utils/validate';
import { readFileSync } from 'fs';
const yaml = require('js-yaml')
import { TestCaseResourceDeploymentConstruct } from './resource_constructs/basic_constructs/test-case-resource-deployment-construct';


export function deployResources(app: cdk.App, clusterStackMap: Map <string, ClusterStack>) {
    // load the file
    const testcaseConfigRoute = process.env.TESTCASE_CONFIG_PATH
    // if no testcase config path is provided, throw error
    if (testcaseConfigRoute == undefined){
        throw new Error ('No path provided for testcase configuration')
    }
    // if testcase config path doesn't route to a yaml file, throw error
    if (!/(.yml|.yaml)$/.test(testcaseConfigRoute)){
        throw new Error ('Path for testcase configuration must be to a yaml file')
    }

    // load the data from the file
    const raw = readFileSync(testcaseConfigRoute, {encoding: 'utf-8'})
    const data = yaml.load(raw)
    validateTestcaseConfig(data)
    const testcaseConfig = data['testcase']

    // load the scope and the props for the resources
    const region = process.env.REGION
    if (region == undefined) {
        throw new Error ('Region environment variable not set')
    }
    const clusterName = testcaseConfig['clusterName']
    const clusterStack = clusterStackMap.get(clusterName)
    if (clusterStack == undefined) {
        throw Error('Cluster name "' + clusterName + '" does not reference an existing cluster')
    }
    const cluster = clusterStack.cluster
    const sampleAppImageURL = testcaseConfig['sampleAppImageURL']
    const sampleAppMode = testcaseConfig['sampleAppMode']
    const aocConfig = testcaseConfig['aocConfig']

    new TestCaseResourceDeploymentConstruct(clusterStack, 'test-case-resource-deployment-construct', {
        cluster: cluster,
        sampleAppImageURL: sampleAppImageURL,
        sampleAppMode: sampleAppMode,
        region: region,
        aocConfig: aocConfig
    })
}