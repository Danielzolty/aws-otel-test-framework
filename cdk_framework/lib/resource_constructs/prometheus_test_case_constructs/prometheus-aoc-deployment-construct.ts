import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../universal_constructs/namespace-construct';
import { ServiceAccountConstruct } from '../universal_constructs/service-account-construct';

export class PrometheusAOCDeploymentConstruct extends Construct {
    aocDeployment: Construct

    constructor(scope: Construct, id: string, props: PrometheusAOCDeploymentConstructProps) {
        super(scope, id);

        const aocConfigMountPath = '/aoc'
        const aocDeploymentManifest = {
        }
        
        this.aocDeployment = props.cluster.addManifest('aoc-deployment', aocDeploymentManifest)
        this.aocDeployment.node.addDependency(props.namespaceConstruct.namespace)
        this.aocDeployment.node.addDependency(props.serviceAccountConstruct.serviceAccount)
    }
}

export interface PrometheusAOCDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
    aocAppLabel: string
    serviceAccountConstruct: ServiceAccountConstruct
}