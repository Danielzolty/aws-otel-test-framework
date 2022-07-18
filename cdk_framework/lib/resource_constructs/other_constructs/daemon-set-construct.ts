import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class DaemonSetConstruct extends Construct{
    constructor(scope: Construct, id: string, props: DaemonSetConstructProps){
        super(scope, id);
        const daemonSetManifest = {
            kind: "DaemonSet",

            yamlBody: data.template_file.daemonset_file[count.index].rendered
            
            dependsOn: [
              kubectl_manifest.config_map
            ]       
        }
        props.cluster.addManifest('daemon-set', daemonSetManifest)
    }
}

export interface DaemonSetConstructProps {
    cluster: eks.ICluster;
}