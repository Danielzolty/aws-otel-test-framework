import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './universal_constructs/namespace-construct';
import { PullModeSampleAppDeploymentConstruct } from './prometheus_test_case_constructs/pull-mode-sample-app-construct';
import { GeneralPrometheusAOCDeploymentConstruct } from './prometheus_test_case_constructs/general-prometheus-aoc-deployment-construct';

export class PrometheusTestCaseResourceDeploymentConstruct extends Construct {
    name: string
    namespace: Construct

    constructor(scope: Construct, id: string, props: PrometheusTestCaseResourceDeploymentConstructProps){
        super(scope, id);

        // namespace deployment
        const namespaceName = `aoc-namespace`
        const aocNamespaceConstruct = new NamespaceConstruct(this, 'aoc-namespace-construct', {
            cluster: props.cluster,
            name: namespaceName
        })

        // sample app deployment
        const listenAddressHost = '0.0.0.0'
        const listenAddressPort = 8080
        new PullModeSampleAppDeploymentConstruct(this, 'pull-mode-sample-app-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            sampleAppLabel: 'sample-app',
            listenAddressHost: listenAddressHost,
            listenAddressPort: listenAddressPort,
            region: props.region
        })

        // general AOC deployment
        new GeneralPrometheusAOCDeploymentConstruct(this, 'general-prometheus-aoc-deployment-construct', {
            cluster: props.cluster,
            namespaceConstruct: aocNamespaceConstruct,
            aocConfig: props.aocConfig,
        })
    }
}

export interface PrometheusTestCaseResourceDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    region: string
    aocConfig: string
}