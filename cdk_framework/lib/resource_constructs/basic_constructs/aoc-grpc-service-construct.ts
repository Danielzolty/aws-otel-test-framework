import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';

export class AOCGRPCServiceConstruct extends Construct {
    aocGRPCService: Construct

    constructor(scope: Construct, id: string, props: AOCGRPCConstructProps){
        super(scope, id);
        
        // define the manifest
        const AOCGRPCServiceManifest = {
            apiVersion: 'v1',
            kind: 'Service',

            metadata: {
                name: props.name,
                namespace: props.namespaceName
            },
            spec: {
                selector: {
                    app: props.aocLabelSelector
                },
            
                ports: [
                    {
                        port: props.grpcPort,
                        targetPort: props.grpcPort,
                        protocol: 'TCP'
                    }
                ]
            }
        }

        // add the manifest to the cluster
        this.aocGRPCService = props.cluster.addManifest('aoc-grpc-service', AOCGRPCServiceManifest)
    }
}

export interface AOCGRPCConstructProps {
    cluster: ICluster
    name: string
    namespaceName: string
    aocLabelSelector: string
    grpcPort: number
}