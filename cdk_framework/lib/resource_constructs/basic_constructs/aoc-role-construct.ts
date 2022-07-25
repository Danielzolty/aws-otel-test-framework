import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';


export class AOCRoleConstruct extends Construct{
    name: string
    aocRole: Construct

    constructor(scope: Construct, id: string, props: aocRoleConstructProps){
        super(scope, id);

        this.name = `aoc-role-${props.testingID}`

        // define the manifest
        const aocRoleManifest = {
            apiVersion: "v1",
            kind: "ServiceAccount",
            metadata: {
                name: this.name,
                namespace: props.aocNamespaceConstruct.name
            },
            
            automountServiceAccountToken: true
        }

        // add the manifest to the cluster
        this.aocRole = props.cluster.addManifest('aoc-role', aocRoleManifest)
    }
}

export interface aocRoleConstructProps {
    cluster: ICluster
    testingID: Number
    aocNamespaceConstruct: AOCNamespaceConstruct
}