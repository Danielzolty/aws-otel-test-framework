import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class aocFargateNSConstruct extends Construct{
    name : string
    constructor(scope: Construct, id: string, props: aocFargateNSConstructProps){
        super(scope, id);
        
        this.name = 'aoc-fargate-ns-' + random_number
        const aocNsManifest = {
            kind: 'Namespace',

            metadata: { 
                name: this.name
            },
        }
        
        props.cluster.addManifest('aoc-fargate-ns', aocNsManifest)
    }
}

export interface aocFargateNSConstructProps {
    cluster: eks.ICluster;
}