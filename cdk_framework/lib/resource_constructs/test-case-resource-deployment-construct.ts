import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './universal_constructs/namespace-construct';
import { OTLPTestCaseResourceDeploymentConstruct } from './otlp-test-case-resource-deployment-construct';
import { PrometheusTestCaseResourceDeploymentConstruct } from './prometheus-test-case-resource-deployment-construct';

export class TestCaseResourceDeploymentConstruct extends Construct {
    name: string
    namespace: Construct

    constructor(scope: Construct, id: string, props: TestCaseResourceDeploymentConstructProps){
        super(scope, id);

        if (props.baseScenario === 'otlp') {
            new OTLPTestCaseResourceDeploymentConstruct(this, 'oltp-test-case-resource-deployment-construct', {
                cluster: props.cluster,
                region: props.region,
                aocConfig: props.aocConfig
            })
        }
        if (props.baseScenario === 'prometheus') {
            new PrometheusTestCaseResourceDeploymentConstruct(this, 'prometheus-test-case-resource-deployment-construct', {
                cluster: props.cluster,
                region: props.region,
                aocConfig: props.aocConfig
            })
        }
    }
}

export interface TestCaseResourceDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    baseScenario: string
    region: string
    aocConfig: string
}