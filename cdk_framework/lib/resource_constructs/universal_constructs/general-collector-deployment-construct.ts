import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './namespace-construct';

export class GeneralCollectorDeploymentConstruct extends Construct {
    name: string
    namespace: Construct

    constructor(scope: Construct, id: string, props: GeneralCollectorDeploymentConstructProps){
        super(scope, id);
        const collectorAppLabel = 'collector'

        
    }
}

export interface GeneralCollectorDeploymentConstructProps {
    cluster: Cluster | FargateCluster,
    namespaceConstruct: NamespaceConstruct,
    collectorScenario: string,
    aocConfig: string
}