import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../universal_constructs/namespace-construct';
import { GRPCServiceConstruct } from './grpc-service-construct';
import { ServiceAccountConstruct } from '../universal_constructs/service-account-construct';
import { AOCConfigMapConstruct } from './aoc-config-map-construct';
import { OTLPAOCDeploymentConstruct } from './otlp-aoc-deployment-construct';
import { TCPServiceConstruct } from './tcp-service-construct';
import { UDPServiceConstruct } from './udp-service-construct';

//TODO - Consider renaming. Role is a different Kubernetes kind so 
// this name is confusing
export class GeneralOTLPAOCDeploymentConstruct extends Construct{
    aocRole: Construct

    constructor(scope: Construct, id: string, props: GeneralOTLPAOCDeploymentConstructProps) {
        super(scope, id);
        const aocAppLabel = 'aoc'

        new GRPCServiceConstruct(this, 'grpc-service-construct', {
            cluster: props.cluster,
            name: props.grpcServiceName,
            namespaceConstruct: props.namespaceConstruct,
            appLabel: aocAppLabel,
            grpcPort: props.grpcPort
        })
        new UDPServiceConstruct(this, 'udp-service-construct', {
            cluster: props.cluster,
            name: props.udpServiceName,
            namespaceConstruct: props.namespaceConstruct,
            appLabel: aocAppLabel,
            udpPort: props.udpPort
        })
        new TCPServiceConstruct(this, 'tcp-service-construct', {
            cluster: props.cluster,
            name: props.tcpServiceName,
            namespaceConstruct: props.namespaceConstruct,
            appLabel: aocAppLabel,
            httpPort: props.httpPort
        })

        const serviceAccountName = `aoc-service-account`
        const serviceAccountConstruct = new ServiceAccountConstruct(this, 'service-account-construct', {
            cluster: props.cluster,
            name: serviceAccountName,
            namespaceConstruct: props.namespaceConstruct
        })

        const aocConfigMapConstruct = new AOCConfigMapConstruct(this, 'aoc-config-map-construct', {
            cluster: props.cluster,
            namespaceConstruct: props.namespaceConstruct,
            aocConfig: props.aocConfig
        })

        new OTLPAOCDeploymentConstruct(this, 'otlp-aoc-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: props.namespaceConstruct,
            aocAppLabel: aocAppLabel,
            serviceAccountConstruct: serviceAccountConstruct,
            aocConfigMapConstruct: aocConfigMapConstruct
        })
    }
}

export interface GeneralOTLPAOCDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
    aocConfig: string
    grpcServiceName: string
    grpcPort: number
    udpServiceName: string
    udpPort: number
    tcpServiceName: string
    httpPort: number
}