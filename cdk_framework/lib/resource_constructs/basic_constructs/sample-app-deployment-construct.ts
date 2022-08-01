import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { PushModeSampleAppDeploymentConstruct } from './push-mode-sample-app-construct';
import { PullModeSampleAppDeploymentConstruct } from '../other_constructs/pull-mode-sample-app-construct';
import { NamespaceConstruct } from './namespace-construct';


export class SampleAppDeploymentConstruct extends Construct {
    sampleAppDeployment: Construct

    constructor(scope: Construct, id: string, props: SampleAppDeploymentConstructProps){
         super(scope, id);

         if (props.sampleAppMode === 'push'){
            const pushModeSampleAppDeploymentConstruct = new PushModeSampleAppDeploymentConstruct(this, 'push-mode-sample-app-construct', {
                cluster: props.cluster,
                namespaceConstruct: props.namespaceConstruct,
                sampleAppLabelSelector: props.sampleAppLabel,
                sampleAppImageURL: props.sampleAppImageURL,
                grpcServiceName: props.grpcServiceName,
                grpcPort: props.grpcPort,
                udpServiceName: props.udpServiceName,
                udpPort: props.udpPort,
                tcpServiceName: props.tcpServiceName,
                httpPort: props.httpPort,
                listenAddressHost: props.listenAddressHost,
                listenAddressPort: props.listenAddressPort,
                region: props.region,
            })
            this.sampleAppDeployment = pushModeSampleAppDeploymentConstruct.pushModeSampleAppDeployment
         }
        //  else if (props.sampleAppMode === 'pull'){
        //     const pullModeSampleAppDeploymentConstruct = new PullModeSampleAppDeploymentConstruct(this, 'pull-mode-sample-app-construct', {
        //        cluster: props.cluster,
        //        aocNamespaceConstruct: props.aocNamespaceConstruct
        //     })
        //    this.sampleAppLabelSelector = pullModeSampleAppDeploymentConstruct.sampleAppLabelSelector
        //    this.sampleAppDeployment = pullModeSampleAppDeploymentConstruct.pullModeSampleAppDeployment
        //  }
    }
}

export interface SampleAppDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
    sampleAppLabel: string
    sampleAppImageURL: string
    sampleAppMode: string
    grpcServiceName: string
    grpcPort: number
    udpServiceName: string
    udpPort: number
    tcpServiceName: string
    httpPort: number
    listenAddressHost: string
    listenAddressPort: number
    region: string
}