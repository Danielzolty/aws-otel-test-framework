import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './universal_constructs/namespace-construct';
import { GeneralOTLPAOCDeploymentConstruct } from './otlp_test_case_constructs/general-oltp-aoc-deployment-construct';
import { PushModeSampleAppDeploymentConstruct } from './otlp_test_case_constructs/push-mode-sample-app-construct';

export class OTLPTestCaseResourceDeploymentConstruct extends Construct {
    name: string
    namespace: Construct

    constructor(scope: Construct, id: string, props: OTLPTestCaseResourceDeploymentConstructProps){
        super(scope, id);

        // namespace deployment
        const namespaceName = `aoc-namespace`
        const aocNamespaceConstruct = new NamespaceConstruct(this, 'aoc-namespace-construct', {
            cluster: props.cluster,
            name: namespaceName
        })

        const listenAddressHost = '0.0.0.0'
        const listenAddressPort = 8080
        const grpcServiceName = 'aoc-grpc'
        const grpcPort = 4317
        const udpServiceName = 'aoc-udp'
        const udpPort = 55690
        const tcpServiceName = 'aoc-tcp'
        const httpPort = 4318

        new PushModeSampleAppDeploymentConstruct(this, 'push-mode-sample-app-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            sampleAppLabel: 'sample-app',
            listenAddressHost: listenAddressHost,
            listenAddressPort: listenAddressPort,
            region: props.region,
            grpcServiceName: grpcServiceName,
            grpcPort: grpcPort,
            udpServiceName: udpServiceName,
            udpPort: udpPort,
            tcpServiceName: tcpServiceName,
            httpPort: httpPort
        })

        // general AOC deployment
        new GeneralOTLPAOCDeploymentConstruct(this, 'general-oltp-aoc-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            aocConfig: props.aocConfig,
            grpcServiceName: grpcServiceName,
            grpcPort: grpcPort,
            udpServiceName: udpServiceName,
            udpPort: udpPort,
            tcpServiceName: tcpServiceName,
            httpPort: httpPort
        })
    }
}

export interface OTLPTestCaseResourceDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    region: string
    aocConfig: string
}