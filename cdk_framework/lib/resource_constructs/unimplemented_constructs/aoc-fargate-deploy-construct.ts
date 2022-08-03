import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../universal_constructs/namespace-construct';

export class aocFargateDeployConstruct extends Construct{
    constructor(scope: Construct, id: string, props: aocFargateDeployConstructProps){
        super(scope, id);
        // TODO: Confirm this is of kind service
        const aocFargateDeployManifest = {
            kind: 'Service',
            yamlBody: templatefile('./container-insights-agent/stateful_set_fargate.yml',
                                        {
                                            ClusterName : var.eks_cluster_name,
                                            AocRepo : var.aoc_image_repo,
                                            AocTag : var.aoc_version,
                                            Namespace : tolist(aws_eks_fargate_profile.test_profile[count.index].selector)[0].namespace
                                        }
                                  )
            // dependsOn: [
            //   kubectl_manifest.aoc_service_deploy,
            //   aws_eks_fargate_profile.test_profile
            // ]
        }

        props.cluster.addManifest('aoc-fargate-deploy', aocFargateDeployManifest)
    }
}

export interface aocFargateDeployConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
}