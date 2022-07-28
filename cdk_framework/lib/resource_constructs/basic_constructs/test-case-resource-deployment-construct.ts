import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './namespace-construct';
import { SampleAppDeploymentConstruct } from './sample-app-deployment-construct';
import { GeneralAOCDeploymentConstruct } from './general-aoc-deployment-construct';

export class TestCaseResourceDeploymentConstruct extends Construct {
    name: string
    namespace: Construct

    constructor(scope: Construct, id: string, props: TestCaseResourceDeploymentConstructProps){
        super(scope, id);
        const testingID = 1

        // namespace deployment
        const namespaceName = `aoc-namespace-${testingID}`
        const aocNamespaceConstruct = new NamespaceConstruct(this, 'aoc-namespace-construct', {
            cluster: props.cluster,
            name: namespaceName
        })

        // sample app deployment
        const sampleAppLabel = 'sample-app'
        const grpcServiceName = 'aoc-grpc'
        const grpcPort = 4317
        const sampleAppDeploymentConstruct = new SampleAppDeploymentConstruct(this, 'sample-app-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            sampleAppLabel: sampleAppLabel,
            sampleAppImageURL: props.sampleAppImageURL,
            sampleAppMode: props.sampleAppMode,
            grpcServiceName: grpcServiceName,
            grpcPort: grpcPort,
            region: props.region
        })

        // general AOC deployment
        const deployGRPCService = props.sampleAppMode === 'push'
        const serviceAccountName = `aoc-service-account-${testingID}`
        const generalAOCDeploymentConstruct = new GeneralAOCDeploymentConstruct(this, 'general-aoc-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            deployGRPCService: deployGRPCService,
            grpcServiceName: grpcServiceName,
            grpcPort: grpcPort,
            serviceAccountName: serviceAccountName,
            aocConfig: props.aocConfig
        })
    }
}

export interface TestCaseResourceDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    sampleAppImageURL: string
    sampleAppMode: string
    region: string
    aocConfig: string
}