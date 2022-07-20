import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';

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
    cluster: ICluster;
}