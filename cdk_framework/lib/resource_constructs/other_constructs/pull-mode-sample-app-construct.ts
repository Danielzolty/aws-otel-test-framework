import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../basic_constructs/namespace-construct';


export class PullModeSampleAppDeploymentConstruct extends Construct {
    pullModeSampleAppDeployment: Construct

    constructor(scope: Construct, id: string, props: PullModeSampleAppDeploymentConstructProps) {
        super(scope, id);

        const listenAddressHost = '0.0.0.0'
        const listenAddressPort = 8080
        
        const pullModeAppManifest = {
            kind: 'Deployment',
            
            metadata: {
                name: 'sample-app',
                namespace: props.namespaceConstruct.name,
                labels: {
                    name: 'sample-app',
                }
            },

            spec: {
                replicas: 1,

                selector: {
                    matchLabels: {
                        app: props.sampleAppLabelSelector
                    }
                },

                template: {
                    metadata: {
                        labels: {
                            app: props.sampleAppLabelSelector
                        }
                    },

                    spec: {
                        container: {
                            name: 'sample-app',
                            image: props.sampleAppImageURL,
                            imagePullPolicy: 'Always',
                            command: null,
                            args: null,
                            env: [
                                {
                                    name: 'AWS_REGION',
                                    value: props.region
                                },
                                {
                                    name: 'INSTANCE_ID',
                                    value: '1'
                                },
                                {
                                    name: 'LISTEN_ADDRESS',
                                    value: `${listenAddressHost}:${listenAddressPort}`
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
                                    port: `${listenAddressPort}`
                                },
                                initialDelaySeconds: 10,
                                periodSeconds: 5
                            } 
                        }
                    }
                }
            }
        }
        
        this.pullModeSampleAppDeployment = props.cluster.addManifest('pull-mode-sample-app', pullModeAppManifest)
   }
}

export interface PullModeSampleAppDeploymentConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
    sampleAppLabelSelector: string
    sampleAppImageURL: string
    region: string
}