import { Stack, StackProps, aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AOCNamespaceConstruct } from '../resource_constructs/basic_constructs/aoc-namespace-construct'
import { SampleAppDeploymentConstruct } from '../resource_constructs/basic_constructs/sample-app-deployment-construct'
import { AOCConfigMapConstruct } from '../resource_constructs/basic_constructs/aoc-config-map-construct'
import { AOCDeploymentConstruct } from '../resource_constructs/basic_constructs/aoc-deployment-construct'
import { MockedServerCertConstruct } from '../resource_constructs/basic_constructs/mocked-server-cert-construct';


export class ResourceDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: ResourceDeploymentStackProps) {
    super(scope, id, props);

    // add Namespace resource
    const aocNamespaceConstruct = new AOCNamespaceConstruct(this, 'aoc-ns-construct', {
        cluster: props.cluster
    })

    // // add Sample App resource
    // const sampleAppDeploymentConstruct = new SampleAppDeploymentConstruct(this, 'sample-app-deployment-construct', {
    //     cluster : props.cluster,
    //     sampleAppImageURL: props.sampleAppImageURL,
    //     sampleAppMode: props.sampleAppMode,
    //     aocNamespaceConstruct: aocNamespaceConstruct
    // })

    // // add AOC Config Map resource
    // const aocConfigMapConstruct = new AOCConfigMapConstruct(this, 'aoc-config-map-construct', {
    //     cluster : props.cluster,
    //     aocNamespaceConstruct : aocNamespaceConstruct,
    //     aocConfig : props.aocConfig
    // })

    // // add MockedServerCert resource
    // const mockedServerCertConstruct = new MockedServerCertConstruct(this, 'mocked-server-cert', {
    //     cluster: props.cluster,
    //     aocNamespaceConstruct: aocConfigMapConstruct
    // })

    // // add AOCDeployment resource
    // const aocDeploymentConstruct = new AOCDeploymentConstruct(this, 'aoc-deployment-construct', {
    //     cluster: props.cluster,
    //     aocNamespaceConstruct: aocNamespaceConstruct,
    //     sampleAppDeploymentConstruct: sampleAppDeploymentConstruct,
    //     aocConfigMapConstruct: aocConfigMapConstruct,
    //     mockedServerCertConstruct: mockedServerCertConstruct
    // })
  }
}

export interface ResourceDeploymentStackProps extends StackProps {
    cluster: eks.ICluster
    sampleAppImageURL: string
    sampleAppMode: string
    aocConfig : Object
}