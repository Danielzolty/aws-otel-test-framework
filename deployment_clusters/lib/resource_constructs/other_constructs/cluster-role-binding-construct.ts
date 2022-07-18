import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class ClusterRoleBindingConstruct extends Construct{
    constructor(scope: Construct, id: string, props: ClusterRoleBindingConstructProps){
        super(scope, id);
        const clusterRoleBindingManifest = {
            kind: "ClusterRoleBinding",

            yamlBody: var.deployment_type == "fargate" ? templatefile("./container-insights-agent/cluster_role_binding_fargate.yml", { Namespace : tolist(aws_eks_fargate_profile.test_profile[count.index].selector)[0].namespace }) : data.template_file.cluster_role_binding_file[count.index].rendered,
            
            dependsOn: [
              kubectl_manifest.cluster_role,
              aws_eks_fargate_profile.test_profile
            ]
        }
        
        props.cluster.addManifest('cluster-role-binding', clusterRoleBindingManifest)
    }
}

export interface ClusterRoleBindingConstructProps {
    cluster: eks.ICluster;
}