import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';


export class AOCConfigMapConstruct extends Construct{
    name : string

    constructor(scope: Construct, id: string, props: AOCConfigMapConstructProps){
        super(scope, id);

        this.name = 'otel-config'
        const aocConfigMapManifest = {
            metadata: {
              name: this.name,
              namespace: props.aocNamespaceConstruct.name
            },
            
            data: {
              "aoc-config.yml": props.aocConfig
            },

            depends_on: [aws_eks_fargate_profile.test_profile]
        }
        
        props.cluster.addManifest('aoc-config-map', aocConfigMapManifest)
    }
}

export interface AOCConfigMapConstructProps {
    cluster: eks.ICluster
    aocNamespaceConstruct: AOCNamespaceConstruct
    //What type should this be?
    aocConfig: Object
}