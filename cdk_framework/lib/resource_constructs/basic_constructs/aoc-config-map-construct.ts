import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';


export class AOCConfigMapConstruct extends Construct{
    name : string

    constructor(scope: Construct, id: string, props: AOCConfigMapConstructProps){
        super(scope, id);

        this.name = 'otel-config'
        const aocConfigMapManifest = {
            apiVersion: 'v1',
            metadata: {
              name: this.name,
              namespace: props.aocNamespaceConstruct.name
            },
            
            data: {
              'aoc-config.yml': props.aocConfig
            },

            depends_on: [aws_eks_fargate_profile.test_profile]
        }
        
        props.cluster.addManifest('aoc-config-map', aocConfigMapManifest)
    }
}

export interface AOCConfigMapConstructProps {
    cluster: ICluster
    aocNamespaceConstruct: AOCNamespaceConstruct
    //What type should this be?
    aocConfig: Object
}