import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../basic_constructs/namespace-construct';


export class LogsSampleFargateDeployConstruct extends Construct{
    constructor(scope: Construct, id: string, props: LogsSampleFargateDeployConstructProps){
        super(scope, id);
        const logsSampleFargateDeployManifest = {
            yamlBody: templatefile('./container-insights-agent/logs_sample_fargate.yml',
                                    {
                                        Namespace : tolist(aws_eks_fargate_profile.test_profile[count.index].selector)[0].namespace
                                    }
                                  )
            // dependsOn: [
            //     kubectl_manifest.aoc_fargate_deploy,
            //     aws_eks_fargate_profile.test_profile
            // ]
        }
        props.cluster.addManifest('logs-sample-fargate-deploy', logsSampleFargateDeployManifest)
    }
}

export interface LogsSampleFargateDeployConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
}