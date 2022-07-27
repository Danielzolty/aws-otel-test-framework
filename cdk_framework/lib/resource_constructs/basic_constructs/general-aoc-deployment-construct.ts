import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './namespace-construct';
import { GRPCServiceConstruct } from './grpc-service-construct';
import { ServiceAccountConstruct } from './service-account-construct';
import { AOCConfigMapConstruct } from './aoc-config-map-construct';
import { AOCDeploymentConstruct } from './aoc-deployment-construct';

//TODO - Consider renaming. Role is a different Kubernetes kind so 
// this name is confusing
export class GeneralAOCDeploymentConstruct extends Construct{
    aocRole: Construct

    constructor(scope: Construct, id: string, props: GeneralAOCDeploymentConstructProps) {
        super(scope, id);
        const aocAppLabel = 'aoc'
        const aocConfigMapName = 'otel-config'
        const aocConfigPath = 'aoc-config.yml'

        if (props.deployGRPCService){
            if (props.grpcServiceName == undefined) {
                throw new Error('No GRPC Service name provided')
            }
            if (props.grpcPort == undefined) {
                throw new Error('No GRPC port provided')
            }
            const grpcServiceConstruct = new GRPCServiceConstruct(this, 'grpc-service-construct', {
                cluster: props.cluster,
                name: props.grpcServiceName,
                namespaceConstruct: props.namespaceConstruct,
                appLabel: aocAppLabel,
                grpcPort: props.grpcPort
            })
        }

        const serviceAccountConstruct = new ServiceAccountConstruct(this, 'service-account-construct', {
            cluster: props.cluster,
            name: props.serviceAccountName,
            namespaceConstruct: props.namespaceConstruct
        })

        const aocConfigMapConstruct = new AOCConfigMapConstruct(this, 'aoc-config-map-construct', {
            cluster: props.cluster,
            name: aocConfigMapName,
            namespaceConstruct: props.namespaceConstruct,
            aocConfigPath: aocConfigPath,
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
    cluster: ICluster
    namespaceConstruct: NamespaceConstruct
    deployGRPCService: boolean
    grpcServiceName?: string
    grpcPort?: number
    serviceAccountName: string
    aocConfig: string
}