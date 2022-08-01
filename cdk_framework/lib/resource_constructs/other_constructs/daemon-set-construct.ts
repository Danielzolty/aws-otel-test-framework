import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { ConfigMapConstruct } from './config-map-construct';


export class DaemonSetConstruct extends Construct {
    daemonSet: Construct
    constructor(scope: Construct, id: string, props: DaemonSetConstructProps){
        super(scope, id);
        const daemonSetManifest = {
            kind: 'DaemonSet',
            yamlBody: data.template_file.daemonset_file[count.index].rendered
            
            // dependsOn: [
            //   kubectl_manifest.config_map
            // ]       
        }
        this.daemonSet = props.cluster.addManifest('daemon-set', daemonSetManifest)
        this.daemonSet.node.addDependency(props.configMapConstruct.configMap)
    }
}

export interface DaemonSetConstructProps {
    cluster: Cluster | FargateCluster
    configMapConstruct: ConfigMapConstruct
}