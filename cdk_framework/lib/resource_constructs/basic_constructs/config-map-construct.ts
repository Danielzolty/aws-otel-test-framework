import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';

export class ConfigMapConstruct extends Construct{
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
        props.cluster.addManifest('config-map', configMapManifest)
    }
}

export interface ConfigMapConstructProps {
    cluster: ICluster;
}