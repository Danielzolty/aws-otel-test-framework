import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';

export class NamespaceConstruct extends Construct {
    name: string
    namespace: Construct

    constructor(scope: Construct, id: string, props: NamespaceConstructProps){
        super(scope, id);
        
        // define the manifest
        const namespaceManifest = {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: { 
                name: props.name
            },
        }

        // add the manifest to the cluster
        this.name = props.name
        this.namespace = props.cluster.addManifest(props.name, namespaceManifest)
    }
}

export interface NamespaceConstructProps {
    cluster: ICluster
    name: string
}