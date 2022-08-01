import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './namespace-construct';
import { SampleAppDeploymentConstruct, SampleAppDeploymentConstructProps } from './sample-app-deployment-construct';
import { GeneralAOCDeploymentConstruct, GeneralAOCDeploymentConstructProps } from './general-aoc-deployment-construct';

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

        // used for when sample app is push mode
        const deployServices = props.sampleAppMode === 'push'
        const grpcServiceName = 'aoc-grpc'
        const grpcPort = 4317
        const udpServiceName = 'aoc-udp'
        const udpPort = 55690
        const tcpServiceName = 'aoc-tcp'
        const httpPort = 4318

        // sample app deployment
        const sampleAppLabel = 'sample-app'
        const listenAddressHost = '0.0.0.0'
        const listenAddressPort = 8080
        const sampleAppDeploymentConstructProps : SampleAppDeploymentConstructProps = {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            sampleAppLabel: sampleAppLabel,
            sampleAppImageURL: props.sampleAppImageURL,
            sampleAppMode: props.sampleAppMode,
            listenAddressHost: listenAddressHost,
            listenAddressPort: listenAddressPort,
            region: props.region
        }
        if (deployServices){
            sampleAppDeploymentConstructProps.grpcServiceName = grpcServiceName
            sampleAppDeploymentConstructProps.grpcPort = grpcPort
            sampleAppDeploymentConstructProps.udpServiceName = udpServiceName
            sampleAppDeploymentConstructProps.udpPort = udpPort
            sampleAppDeploymentConstructProps.tcpServiceName = tcpServiceName
            sampleAppDeploymentConstructProps.httpPort = httpPort
        }
        const sampleAppDeploymentConstruct = new SampleAppDeploymentConstruct(this, 'sample-app-deployment-construct', sampleAppDeploymentConstructProps)

        // general AOC deployment
        const generaAOCDeploymentConstructProps : GeneralAOCDeploymentConstructProps = {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            aocConfig: props.aocConfig,
            deployServices: deployServices
        }
        if (deployServices) {
            generaAOCDeploymentConstructProps.grpcServiceName = grpcServiceName
            generaAOCDeploymentConstructProps.grpcPort = grpcPort
            generaAOCDeploymentConstructProps.udpServiceName = udpServiceName
            generaAOCDeploymentConstructProps.udpPort= udpPort,
            generaAOCDeploymentConstructProps.tcpServiceName = tcpServiceName
            generaAOCDeploymentConstructProps.httpPort = httpPort
        }
        const generalAOCDeploymentConstruct = new GeneralAOCDeploymentConstruct(this, 'general-aoc-deployment-construct', generaAOCDeploymentConstructProps)
    }
}

export interface TestCaseResourceDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    sampleAppImageURL: string
    sampleAppMode: string
    region: string
    aocConfig: string
}