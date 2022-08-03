import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../basic_constructs/namespace-construct';

export class ConfigMapConstruct extends Construct{
    configMap: Construct

    constructor(scope: Construct, id: string, props: ConfigMapConstructProps) {
        super(scope, id);
        const configMapManifest = {
            apiVersion: 'v1',
            kind: 'ConfigMap',
            
            yamlBody: var.deployment_type == 'fargate' ? templatefile('./container-insights-agent/config_map_fargate.yml',
                                                                        {
                                                                            Namespace : tolist(aws_eks_fargate_profile.test_profile[count.index].selector)[0].namespace,
                                                                            TestingId : module.common.testing_id
                                                                        }
                                                                     )
                                                        : data.template_file.config_map_file[count.index].rendered,
            
            // dependsOn: [aws_eks_fargate_profile.test_profile]
        }
        this.configMap = props.cluster.addManifest('config-map', configMapManifest)
    }
}

export interface ConfigMapConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
}