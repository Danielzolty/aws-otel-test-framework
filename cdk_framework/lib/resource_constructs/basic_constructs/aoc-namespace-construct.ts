import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';

export class AOCNamespaceConstruct extends Construct {
    name: string
    aocNamespace: Construct

    constructor(scope: Construct, id: string, props: AOCNamespaceConstructProps){
        super(scope, id);
        
        // define the manifest
        this.name = `aoc-namespace-${props.testingID}`
        const aocNamespaceManifest = {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: { 
                name: this.name
            },
        }

        // add the manifest to the cluster
        this.aocNamespace = props.cluster.addManifest('aoc-namespace', aocNamespaceManifest)
    }
}

export interface AOCNamespaceConstructProps {
    cluster: ICluster
    testingID: number
}