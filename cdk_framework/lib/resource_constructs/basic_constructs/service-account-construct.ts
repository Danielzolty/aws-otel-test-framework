import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './namespace-construct';

export class ServiceAccountConstruct extends Construct {
    name: string
    serviceAccount: Construct

    constructor(scope: Construct, id: string, props: ServiceAccountConstructProps){
        super(scope, id);

        //TODO There's a service account constuct in CDK, should we use that?
        // define the manifest
        const serviceAccountManifest = {
            apiVersion: "v1",
            kind: "ServiceAccount",
            metadata: {
                name: props.name,
                namespace: props.namespaceConstruct.name
            },
            
            automountServiceAccountToken: true
        }

        // add the manifest to the cluster
        this.name = props.name
        this.serviceAccount = props.cluster.addManifest(props.name, serviceAccountManifest)
        this.serviceAccount.node.addDependency(props.namespaceConstruct.namespace)
    }
}

export interface ServiceAccountConstructProps {
    cluster: ICluster
    name: string
    namespaceConstruct: NamespaceConstruct
}