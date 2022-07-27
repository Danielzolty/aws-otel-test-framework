import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { PushModeSampleAppDeploymentConstruct } from './push-mode-sample-app-construct';
import { PullModeSampleAppDeploymentConstruct } from '../other_constructs/pull-mode-sample-app-construct';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';
import { ResourceConfigurationProps } from '../../resource-deployment';


export class SampleAppDeploymentConstruct extends Construct {
    sampleAppLabelSelector: string
    sampleAppDeployment: Construct

    constructor(scope: Construct, id: string, props: ResourceConfigurationProps){
         super(scope, id);

        this.sampleAppLabelSelector = props.sampleAppLabelSelector
         if (props.sampleAppMode === 'push'){
            const pushModeSampleAppDeploymentConstruct = new PushModeSampleAppDeploymentConstruct(this, 'push-mode-sample-app-construct', props)
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

// export interface SampleAppDeploymentConstructProps {
//     cluster: ICluster
//     sampleAppLabelSelector: string
//     sampleAppImageURL: string
//     sampleAppMode: string
//     namespaceName: string
//     grpcServiceName: string
//     grpcPort: number
//     region: string
// }