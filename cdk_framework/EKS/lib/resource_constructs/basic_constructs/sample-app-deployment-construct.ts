import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { PushModeSampleAppDeploymentConstruct } from './push-mode-sample-app-construct';
import { PullModeSampleAppDeploymentConstruct } from './pull-mode-sample-app-construct';
import { NamespaceConstruct } from './namespace-construct';


export class SampleAppDeploymentConstruct extends Construct {
    sampleAppDeployment: Construct

    constructor(scope: Construct, id: string, props: SampleAppDeploymentConstructProps){
         super(scope, id);

         if (props.sampleAppMode === 'push'){
            if (props.grpcServiceName == undefined) {
                throw new Error('No GRPC Service name provided')
            }
            if (props.grpcPort == undefined) {
                throw new Error('No GRPC port provided')
            }
            if (props.udpServiceName == undefined) {
                throw new Error('No UDP Service name provided')
            }
            if (props.udpPort == undefined) {
                throw new Error('No UDP port provided')
            }
            if (props.tcpServiceName == undefined) {
                throw new Error('No TCP Service name provided')
            }
            if (props.httpPort == undefined) {
                throw new Error('No HTTP port provided')
            }
            const pushModeSampleAppDeploymentConstruct = new PushModeSampleAppDeploymentConstruct(this, 'push-mode-sample-app-construct', {
                cluster: props.cluster,
                namespaceConstruct: props.namespaceConstruct,
                sampleAppLabelSelector: props.sampleAppLabel,
                sampleAppImageURI: props.sampleAppImageURI,
                grpcServiceName: props.grpcServiceName,
                grpcPort: props.grpcPort,
                udpServiceName: props.udpServiceName,
                udpPort: props.udpPort,
                tcpServiceName: props.tcpServiceName,
                httpPort: props.httpPort,
                listenAddressHost: props.listenAddressHost,
                listenAddressPort: props.listenAddressPort,
                region: props.region
            })
            this.sampleAppDeployment = pushModeSampleAppDeploymentConstruct.pushModeSampleAppDeployment
         }
         else if (props.sampleAppMode === 'pull'){
            const pullModeSampleAppDeploymentConstruct = new PullModeSampleAppDeploymentConstruct(this, 'pull-mode-sample-app-construct', {
                cluster: props.cluster,
                namespaceConstruct: props.namespaceConstruct,
                sampleAppLabelSelector: props.sampleAppLabel,
                sampleAppImageURI: props.sampleAppImageURI,
                listenAddressHost: props.listenAddressHost,
                listenAddressPort: props.listenAddressPort,
                region: props.region
            })
           this.sampleAppDeployment = pullModeSampleAppDeploymentConstruct.pullModeSampleAppDeployment
         }
    }
}

export interface SampleAppDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
    sampleAppLabel: string
    sampleAppImageURI: string
    sampleAppMode: string
    listenAddressHost: string
    listenAddressPort: number
    region: string
    grpcServiceName?: string
    grpcPort?: number
    udpServiceName?: string
    udpPort?: number
    tcpServiceName?: string
    httpPort?: number
}