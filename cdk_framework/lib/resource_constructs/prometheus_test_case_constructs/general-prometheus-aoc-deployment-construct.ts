import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../universal_constructs/namespace-construct';
import { ServiceAccountConstruct } from '../universal_constructs/service-account-construct';
import { PrometheusAOCDeploymentConstruct } from './prometheus-aoc-deployment-construct';

export class GeneralPrometheusAOCDeploymentConstruct extends Construct{
    
    constructor(scope: Construct, id: string, props: GeneralPrometheusAOCDeploymentConstructProps) {
        super(scope, id);
        const aocAppLabel = 'aoc'

        const serviceAccountName = `aoc-service-account`
        const serviceAccountConstruct = new ServiceAccountConstruct(this, 'service-account-construct', {
            cluster: props.cluster,
            name: serviceAccountName,
            namespaceConstruct: props.namespaceConstruct
        })

        new PrometheusAOCDeploymentConstruct(this, 'prometheus-aoc-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: props.namespaceConstruct,
            aocAppLabel: aocAppLabel,
            serviceAccountConstruct: serviceAccountConstruct
        })
    }
}

export interface GeneralPrometheusAOCDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
    aocConfig: string
}