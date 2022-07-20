import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class aocServiceDeployConstruct extends Construct{
    constructor(scope: Construct, id: string, props: aocServiceDeployConstructProps){
        super(scope, id);
        const aocServiceDeployManifest = {
            kind: 'Service',
            yamlBody: templatefile('./container-insights-agent/aoc_service_fargate.yml', { Namespace : tolist(aws_eks_fargate_profile.test_profile[count.index].selector)[0].namespace }),
            dependsOn: [
                kubectl_manifest.config_map,
                aws_eks_fargate_profile.test_profile
            ]
        }

        props.cluster.addManifest('aoc-service-deploy', aocServiceDeployManifest)
    }
}

export interface aocServiceDeployConstructProps {
    cluster: eks.ICluster;
}