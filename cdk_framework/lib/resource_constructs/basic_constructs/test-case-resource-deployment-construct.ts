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

        // namespace deployment
        const namespaceName = `aoc-namespace`
        const aocNamespaceConstruct = new NamespaceConstruct(this, 'aoc-namespace-construct', {
            cluster: props.cluster,
            name: namespaceName
        })

        // sample app deployment
        const sampleAppLabel = 'sample-app'
        const grpcServiceName = 'aoc-grpc'
        const grpcPort = 4317
        const udpServiceName = 'aoc-udp'
        const udpPort = 55690
        const tcpServiceName = 'tcp-udp'
        const httpPort = 4318
        const listenAddressHost = '0.0.0.0'
        const listenAddressPort = 8080
        const sampleAppDeploymentConstruct = new SampleAppDeploymentConstruct(this, 'sample-app-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            sampleAppLabel: sampleAppLabel,
            sampleAppImageURL: props.sampleAppImageURL,
            sampleAppMode: props.sampleAppMode,
            grpcServiceName: grpcServiceName,
            grpcPort: grpcPort,
            udpServiceName: udpServiceName,
            udpPort: udpPort,
            tcpServiceName: tcpServiceName,
            httpPort: httpPort,
            listenAddressHost: listenAddressHost,
            listenAddressPort: listenAddressPort,
            region: props.region
        })

        // general AOC deployment
        const deployGRPCService = props.sampleAppMode === 'push'
        const serviceAccountName = `aoc-service-account`
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