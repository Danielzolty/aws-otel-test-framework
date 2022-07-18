import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class LogsSampleFargateDeployConstruct extends Construct{
    constructor(scope: Construct, id: string, props: LogsSampleFargateDeployConstructProps){
        super(scope, id);
        const logsSampleFargateDeployManifest = {
            yamlBody: templatefile("./container-insights-agent/logs_sample_fargate.yml",
                                    {
                                        Namespace : tolist(aws_eks_fargate_profile.test_profile[count.index].selector)[0].namespace
                                    }
                                  )
            dependsOn: [
              kubectl_manifest.aoc_fargate_deploy,
              aws_eks_fargate_profile.test_profile
            ]
        }
        props.cluster.addManifest('logs-sample-fargate-deploy', logsSampleFargateDeployManifest)
    }
}

export interface LogsSampleFargateDeployConstructProps {
    cluster: eks.ICluster;
}