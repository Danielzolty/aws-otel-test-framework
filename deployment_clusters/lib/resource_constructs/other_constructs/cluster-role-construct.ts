import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class ClusterRoleConstruct extends Construct{
    constructor(scope: Construct, id: string, props: ClusterRoleConstructProps){
        super(scope, id);
        const clusterRoleManifest = {
            kind: "ClusterRole",
            
            yaml_body: var.deployment_type == "fargate" ? file("./container-insights-agent/cluster_role_fargate.yml") : data.template_file.cluster_role_file[count.index].rendered
        }
        
        props.cluster.addManifest('cluster-role', clusterRoleManifest)
    }
}

export interface ClusterRoleConstructProps {
    cluster: eks.ICluster;
}