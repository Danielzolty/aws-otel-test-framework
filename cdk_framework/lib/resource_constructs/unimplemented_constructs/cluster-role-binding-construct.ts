import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../universal_constructs/namespace-construct';

export class ClusterRoleBindingConstruct extends Construct{
    constructor(scope: Construct, id: string, props: ClusterRoleBindingConstructProps){
        super(scope, id);
        const clusterRoleBindingManifest = {
            kind: 'ClusterRoleBinding',

            yamlBody: var.deployment_type == 'fargate' ? templatefile('./container-insights-agent/cluster_role_binding_fargate.yml', { Namespace : tolist(aws_eks_fargate_profile.test_profile[count.index].selector)[0].namespace }) : data.template_file.cluster_role_binding_file[count.index].rendered,
            
            // dependsOn: [
            //     kubectl_manifest.cluster_role,
            //     aws_eks_fargate_profile.test_profile
            // ]
        }
        
        props.cluster.addManifest('cluster-role-binding', clusterRoleBindingManifest)
    }
}

export interface ClusterRoleBindingConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
}