import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from '../basic_constructs/aoc-namespace-construct';


export class PullModeSampleAppDeploymentConstruct extends Construct {
    sampleAppLabelSelector : string

   constructor(scope: Construct, id: string, props: PullModeSampleAppDeploymentConstructProps) {
      super(scope, id);
    
      this.sampleAppLabelSelector = 'sample-app'
      const pullModeAppManifest = {
        kind: 'Deployment',
        
        metadata: {
            name: this.sampleAppLabelSelector,
            namespace: props.aocNamespaceConstruct.name,
            labels: {
                app: this.sampleAppLabelSelector
            }
        },

        spec: {
            replicas: 1,

            selector: {
                matchLabels: {
                    app: this.sampleAppLabelSelector
                }
            },

            template: {
                metadata: {
                    labels: {
                        app: this.sampleAppLabelSelector
                    }
                },

                spec: {
                    //sample app
                    container: {
                        name: this.sampleAppLabelSelector,
                        image: local.eks_pod_config['image'],
                        imagePullPolicy: 'Always',
                        command: length(local.eks_pod_config['command']) != 0 ? local.eks_pod_config['command'] : null,
                        args: length(local.eks_pod_config['args']) != 0 ? local.eks_pod_config['args'] : null,
                        env: [
                            {
                                name: 'AWS_REGION',
                                value: var.region
                            },
                            {
                                name: 'INSTANCE_ID',
                                value: var.testing_id
                            },
                            {
                                name: 'LISTEN_ADDRESS',
                                value: '${var.sample_app.listen_address_ip}:${var.sample_app.listen_address_port}'
                            }
                        ],

                        resources: {
                            limits: {
                                cpu: '0.2',
                                memory: '256Mi'
                            }
                        },

                        readiness_probe: {
                            http_get: {
                                path: '/',
                                port: var.sample_app.listen_address_port
                            },
                            initialDelaySeconds: 10,
                            periodSeconds: 5
                        } 
                    }
                }
            }
        }
      }
      
      props.cluster.addManifest('pull-mode-sample-app', pullModeAppManifest)
   }
}

export interface PullModeSampleAppDeploymentConstructProps {
      cluster: ICluster
      aocNamespaceConstruct: AOCNamespaceConstruct
}