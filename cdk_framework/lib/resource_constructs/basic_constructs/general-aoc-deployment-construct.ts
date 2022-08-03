import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './namespace-construct';
import { GRPCServiceConstruct } from './grpc-service-construct';
import { ServiceAccountConstruct } from './service-account-construct';
import { AOCConfigMapConstruct } from './aoc-config-map-construct';
import { AOCDeploymentConstruct } from './aoc-deployment-construct';
import { TCPServiceConstruct } from './tcp-service-construct';
import { UDPServiceConstruct } from './udp-service-construct';

//TODO - Consider renaming. Role is a different Kubernetes kind so 
// this name is confusing
export class GeneralAOCDeploymentConstruct extends Construct{
    aocRole: Construct

    constructor(scope: Construct, id: string, props: GeneralAOCDeploymentConstructProps) {
        super(scope, id);
        const aocAppLabel = 'aoc'

        if (props.deployServices){
            if (props.grpcServiceName == undefined) {
                throw new Error('No GRPC Service name provided')
            }
            if (props.grpcPort == undefined) {
                throw new Error('No GRPC port provided')
            }
            if (props.udpServiceName == undefined) {
                throw new Error('No UDP Service name provided')
            }
            if (props.udpPort == undefined) {
                throw new Error('No UDP port provided')
            }
            if (props.tcpServiceName == undefined) {
                throw new Error('No TCP Service name provided')
            }
            if (props.httpPort == undefined) {
                throw new Error('No HTTP port provided')
            }
            const grpcServiceConstruct = new GRPCServiceConstruct(this, 'grpc-service-construct', {
                cluster: props.cluster,
                name: props.grpcServiceName,
                namespaceConstruct: props.namespaceConstruct,
                appLabel: aocAppLabel,
                grpcPort: props.grpcPort
            })
            const udpServiceConstruct = new UDPServiceConstruct(this, 'udp-service-construct', {
                cluster: props.cluster,
                name: props.udpServiceName,
                namespaceConstruct: props.namespaceConstruct,
                appLabel: aocAppLabel,
                udpPort: props.udpPort
            })
            const tcoServiceConstruct = new TCPServiceConstruct(this, 'tcp-service-construct', {
                cluster: props.cluster,
                name: props.tcpServiceName,
                namespaceConstruct: props.namespaceConstruct,
                appLabel: aocAppLabel,
                httpPort: props.httpPort
            })
        }

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

        const aocDeploymentConstruct = new AOCDeploymentConstruct(this, 'aoc-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: props.namespaceConstruct,
            aocAppLabel: aocAppLabel,
            serviceAccountConstruct: serviceAccountConstruct,
            aocConfigMapConstruct: aocConfigMapConstruct
        })
    }
}

export interface GeneralAOCDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
    aocConfig: string
    deployServices: boolean
    grpcServiceName?: string
    grpcPort?: number
    udpServiceName?: string
    udpPort?: number
    tcpServiceName?: string
    httpPort?: number
}