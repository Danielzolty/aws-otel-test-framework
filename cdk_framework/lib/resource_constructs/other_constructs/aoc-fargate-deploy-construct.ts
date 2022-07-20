import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


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
            dependsOn: [
              kubectl_manifest.aoc_service_deploy,
              aws_eks_fargate_profile.test_profile
            ]
        }

        props.cluster.addManifest('aoc-fargate-deploy', aocServiceDeployManifest)
    }
}

export interface aocFargateDeployConstructProps {
    cluster: eks.ICluster;
}