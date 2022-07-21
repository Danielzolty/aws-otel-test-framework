import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ClusterStack } from './stacks/cluster-stack';
import { validateTestcaseConfig } from './utils/validate';
import { readFileSync} from 'fs';
const yaml = require('js-yaml')
import { AOCNamespaceConstruct } from './resource_constructs/basic_constructs/aoc-namespace-construct';
import { SampleAppDeploymentConstruct } from './resource_constructs/basic_constructs/sample-app-deployment-construct';
import { AOCConfigMapConstruct } from './resource_constructs/basic_constructs/aoc-config-map-construct';
import { AOCDeploymentConstruct } from './resource_constructs/basic_constructs/aoc-deployment-construct';


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
    const raw = readFileSync(testcaseConfigRoute)
    const data = yaml.load(raw)
    validateTestcaseConfig(data)
    const testcaseConfig = data['testcase']

    // load the scope and the props for the resources
    var clusterName = testcaseConfig['clusterName']
    var clusterStack = clusterStackMap.get(clusterName)
    if (clusterStack == undefined) {
        throw Error('Cluster name "' + clusterName + '" does not reference an existing cluster')
    }
    var cluster = clusterStack.cluster
    var sampleAppImageURL = testcaseConfig['sampleAppImageURL']
    var sampleAppMode = testcaseConfig['sampleAppMode']
    var collectorConfig = testcaseConfig['collectorConfig']

    // deploy resources

    // add Namespace resource
    const aocNamespaceConstruct = new AOCNamespaceConstruct(clusterStack, 'aoc-namespace-construct', {
        cluster: cluster
    })

    // add Sample App resource
    const region = process.env.REGION
    if (region == undefined) {
        throw new Error ('Region environment variable not set')
    }
    const sampleAppDeploymentConstruct = new SampleAppDeploymentConstruct(clusterStack, 'sample-app-deployment-construct', {
        cluster : cluster,
        sampleAppImageURL: sampleAppImageURL,
        sampleAppMode: sampleAppMode,
        aocNamespaceConstruct: aocNamespaceConstruct,
        region: region
    })
    // it doesn't seem that this dependency is being inferred so need to add it explicitely
    sampleAppDeploymentConstruct.node.addDependency(aocNamespaceConstruct)

    // add AOC Config Map resource
    const aocConfigMapConstruct = new AOCConfigMapConstruct(clusterStack, 'aoc-config-map-construct', {
        cluster : cluster,
        aocNamespaceConstruct : aocNamespaceConstruct,
        aocConfig : collectorConfig
    })

    // // add MockedServerCert resource
    // const mockedServerCertConstruct = new MockedServerCertConstruct(this, 'mocked-server-cert', {
    //     cluster: props.cluster,
    //     aocNamespaceConstruct: aocConfigMapConstruct
    // })

    // add AOCDeployment resource
    const aocDeploymentConstruct = new AOCDeploymentConstruct(clusterStack, 'aoc-deployment-construct', {
        cluster: cluster,
        aocNamespaceConstruct: aocNamespaceConstruct,
        sampleAppDeploymentConstruct: sampleAppDeploymentConstruct,
        aocConfigMapConstruct: aocConfigMapConstruct
        // mockedServerCertConstruct: mockedServerCertConstruct
    })



    // new ResourceDeploymentStack(app, clusterName + 'Resources', {
    //     cluster: cluster,
    //     sampleAppImageURL: sampleAppImageURL,
    //     sampleAppMode: sampleAppMode,
    //     aocConfig: collectorConfig
    // })
}