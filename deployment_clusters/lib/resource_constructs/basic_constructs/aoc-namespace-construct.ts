import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class AOCNamespaceConstruct extends Construct{
    name: string

    constructor(scope: Construct, id: string, props: AOCNamespaceConstructProps){
        super(scope, id);
        this.name = 'aoc-ns-' + random_value
        const aocNsManifest = {
            kind: 'Namespace',
            metadata: { 
                //value at the end should be a unique test id (instead of "1")
                name: this.name
            },
        }
        
        props.cluster.addManifest('aoc-ns', aocNsManifest)
    }
}

export interface AOCNamespaceConstructProps {
    cluster: eks.ICluster;
}