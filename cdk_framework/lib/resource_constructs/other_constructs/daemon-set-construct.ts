import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';


export class DaemonSetConstruct extends Construct{
    constructor(scope: Construct, id: string, props: DaemonSetConstructProps){
        super(scope, id);
        const daemonSetManifest = {
            kind: 'DaemonSet',

            yamlBody: data.template_file.daemonset_file[count.index].rendered
            
            dependsOn: [
              kubectl_manifest.config_map
            ]       
        }
        props.cluster.addManifest('daemon-set', daemonSetManifest)
    }
}

export interface DaemonSetConstructProps {
    cluster: ICluster;
}