import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClusterStack } from './stacks/cluster-stack';
import { validateTestcaseConfig } from './utils/validate';
import { readFileSync} from 'fs';
const yaml = require('js-yaml')
import { NamespaceConstruct } from './resource_constructs/basic_constructs/namespace-construct';
import { SampleAppDeploymentConstruct } from './resource_constructs/basic_constructs/sample-app-deployment-construct';
import { GeneralAOCDeploymentConstruct } from './resource_constructs/basic_constructs/general-aoc-deployment-construct';


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
    var clusterName = testcaseConfig['clusterName']
    var clusterStack = clusterStackMap.get(clusterName)
    if (clusterStack == undefined) {
        throw Error('Cluster name "' + clusterName + '" does not reference an existing cluster')
    }
    var cluster = clusterStack.cluster
    var sampleAppImageURL = testcaseConfig['sampleAppImageURL']
    var sampleAppMode = testcaseConfig['sampleAppMode']
    var aocConfig = testcaseConfig['aocConfig']


    // the testing ID should be a unique random value
    const testingID = 1
    const namespaceName = `aoc-namespace-${testingID}`
    const grpcServiceName = 'aoc-grpc'
    const grpcPort = 4317
    const sampleAppLabel = 'sample-app'
    // TODO: This should really be encapsulated within generalAOCDeploymentConstruct
    // it's here now because it's coupled with testingID
    const serviceAccountName = `aoc-service-account-${testingID}`


    // deploy resources

    // add Namespace resource
    const aocNamespaceConstruct = new NamespaceConstruct(clusterStack, 'aoc-namespace-construct', {
        cluster: cluster,
        name: namespaceName
    })

    // add Sample App resource
    const sampleAppDeploymentConstruct = new SampleAppDeploymentConstruct(clusterStack, 'sample-app-deployment-construct', {
        cluster: cluster,
        namespaceConstruct: aocNamespaceConstruct,
        sampleAppLabel: sampleAppLabel,
        sampleAppImageURL: sampleAppImageURL,
        sampleAppMode: sampleAppMode,
        grpcServiceName: grpcServiceName,
        grpcPort: grpcPort,
        region: region
    })

    const deployGRPCService = sampleAppMode === 'push'
    const generalAOCDeploymentConstruct = new GeneralAOCDeploymentConstruct(clusterStack, 'general-aoc-deployment-construct', {
        cluster: cluster,
        namespaceConstruct: aocNamespaceConstruct,
        deployGRPCService: deployGRPCService,
        grpcServiceName: grpcServiceName,
        //TODO what does this evaluate to when no port is passed?
        grpcPort: grpcPort,
        serviceAccountName: serviceAccountName,
        aocConfig: aocConfig
    })
}