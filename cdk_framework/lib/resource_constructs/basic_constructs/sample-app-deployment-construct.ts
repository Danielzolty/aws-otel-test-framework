import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
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
                region: props.region
            })
            this.sampleAppDeployment = pushModeSampleAppDeploymentConstruct.pushModeSampleAppDeployment
         }
        //  else if (props.sampleAppMode === 'pull'){
        //     const pullModeSampleAppDeploymentConstruct = new PullModeSampleAppDeploymentConstruct(this, 'push-mode-sample-app-construct', {
        //        cluster: props.cluster,
        //        aocNamespaceConstruct: props.aocNamespaceConstruct
        //     })
        //    this.sampleAppLabelSelector = pullModeSampleAppDeploymentConstruct.sampleAppLabelSelector
        //    this.sampleAppDeployment = pullModeSampleAppDeploymentConstruct.pullModeSampleAppDeployment
        //  }
    }
}

export interface SampleAppDeploymentConstructProps {
    cluster: ICluster
    namespaceConstruct: NamespaceConstruct
    sampleAppLabel: string
    sampleAppImageURL: string
    sampleAppMode: string
    grpcServiceName: string
    grpcPort: number
    region: string
}