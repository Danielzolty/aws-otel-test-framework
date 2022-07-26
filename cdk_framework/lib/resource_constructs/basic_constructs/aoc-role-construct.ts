import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';

//TODO - Consider renaming. Role is a different Kubernetes kind so 
// this name is confusing
export class AOCRoleConstruct extends Construct{
    aocRole: Construct

    constructor(scope: Construct, id: string, props: aocRoleConstructProps){
        super(scope, id);

        // define the manifest
        const aocRoleManifest = {
            apiVersion: "v1",
            kind: "ServiceAccount",
            metadata: {
                name: props.name,
                namespace: props.namespaceName
            },
            
            automountServiceAccountToken: true
        }

        // add the manifest to the cluster
        this.aocRole = props.cluster.addManifest('aoc-role', aocRoleManifest)
    }
}

export interface aocRoleConstructProps {
    cluster: ICluster
    name: string
    namespaceName: string
}