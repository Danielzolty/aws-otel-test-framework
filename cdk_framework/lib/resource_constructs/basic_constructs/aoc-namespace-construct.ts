import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class AOCNamespaceConstruct extends Construct{
    name: string

    constructor(scope: Construct, id: string, props: AOCNamespaceConstructProps){
        super(scope, id);
        
        // define the manifest
        //TODO: This should be set to a random value
        const random_value = 1
        this.name = 'aoc-namespace-' + random_value
        const aocNsManifest = {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: { 
                name: this.name
            },
        }

        // add the manifest to the cluster
        props.cluster.addManifest('aoc-namespace', aocNsManifest)
    }
}

export interface AOCNamespaceConstructProps {
    cluster: eks.ICluster;
}