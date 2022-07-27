import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';
import { ResourceConfigurationProps } from '../../resource-deployment';

//TODO - Consider renaming. Role is a different Kubernetes kind so 
// this name is confusing
export class AOCRoleConstruct extends Construct{
    aocRole: Construct

    constructor(scope: Construct, id: string, props: ResourceConfigurationProps){
        super(scope, id);

        // define the manifest
        const aocRoleManifest = {
            apiVersion: "v1",
            kind: "ServiceAccount",
            metadata: {
                name: props.aocRoleName,
                namespace: props.aocNamespaceName
            },
            
            automountServiceAccountToken: true
        }

        // add the manifest to the cluster
        this.aocRole = props.cluster.addManifest('aoc-role', aocRoleManifest)
    }
}