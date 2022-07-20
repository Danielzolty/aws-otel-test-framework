import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PushModeSampleAppDeploymentConstruct } from './push-mode-sample-app-construct';
import { PullModeSampleAppDeploymentConstruct } from '../other_constructs/pull-mode-sample-app-construct';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';


export class SampleAppDeploymentConstruct extends Construct{
    sampleAppLabelSelector: string

    constructor(scope: Construct, id: string, props: SampleAppDeploymentConstructProps){
         super(scope, id);

         if (props.sampleAppMode === 'push'){
            const pushModeSampleAppDeploymentConstruct = new PushModeSampleAppDeploymentConstruct(this, 'push-mode-sample-app-construct', {
                cluster: props.cluster,
                aocNamespaceConstruct: props.aocNamespaceConstruct,
                sampleAppImageURL: props.sampleAppImageURL,
                region: props.region
            })
            this.sampleAppLabelSelector = pushModeSampleAppDeploymentConstruct.sampleAppLabelSelector
         }
        //  else if (props.sampleAppMode === 'pull'){
        //     const pullModeSampleAppDeploymentConstruct = new PullModeSampleAppDeploymentConstruct(this, 'push-mode-sample-app-construct', {
        //        cluster: props.cluster,
        //        aocNamespaceConstruct: props.aocNamespaceConstruct
        //     })
        //    this.sampleAppLabelSelector = pullModeSampleAppDeploymentConstruct.sampleAppLabelSelector
        //  }
    }
}

export interface SampleAppDeploymentConstructProps {
    cluster: eks.ICluster
    sampleAppImageURL: string
    sampleAppMode: string
    aocNamespaceConstruct: AOCNamespaceConstruct
    region: string
}