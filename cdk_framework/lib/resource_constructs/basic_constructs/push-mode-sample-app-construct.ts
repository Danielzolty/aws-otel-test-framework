import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';


export class PushModeSampleAppDeploymentConstruct extends Construct {
   pushModeSampleAppDeployment: Construct

   constructor(scope: Construct, id: string, props: PushModeSampleAppDeploymentConstructProps) {
        super(scope, id);

         // configs
         // Using hard-coded values ultimately from push_mode_samples.tf and output.tf (assuming not adot operator)
        const udpPort = 55690
        const listenAddressPort = 8080
        const httpPort = 4318

        const pushModeSampleAppDeploymentManifest = {
            apiVersion: 'apps/v1',
            kind: 'Deployment',
         
            metadata: {
                name: props.sampleAppLabelSelector,
                // namespace: var.aoc_namespace,
                namespace: props.namespaceName,
                labels: {
                    app: props.sampleAppLabelSelector
                }
            },

            spec: {
                replicas: 1,

                selector: {
                    matchLabels: {
                        // app: local.sample_app_label_selector
                        app: props.sampleAppLabelSelector
                    }
                },

                template: {
                    metadata: {
                        labels: {
                            // app: local.sample_app_label_selector
                            app: props.sampleAppLabelSelector
                        }
                    },

                    spec: {
                        //sample app
                        containers: [
                            {
                                name: props.sampleAppLabelSelector,
                                //image: local.eks_pod_config['image'],
                                image: props.sampleAppImageURL,
                                imagePullPolicy: 'Always',
                                //command: length(local.eks_pod_config['command']) != 0 ? local.eks_pod_config['command'] : null,
                                command: null,
                                //args: length(local.eks_pod_config['args']) != 0 ? local.eks_pod_config['args'] : null,
                                args: null,

                                env: [
                                    {
                                        name: 'OTEL_EXPORTER_OTLP_ENDPOINT',
                                        //value: var.is_adot_operator ? 'http://aoc-collector:${var.aoc_service.grpc_port}' : 'http://${kubernetes_service.aoc_grpc_service[0].metadata[0].name}:${var.aoc_service.grpc_port}'
                                        value : `http://${props.grpcServiceName}:${props.grpcPort}`
                                    },
                                    {
                                        name: 'COLLECTOR_UDP_ADDRESS',
                                        // value: '${kubernetes_service.aoc_udp_service[0].metadata[0].name}:${var.aoc_service.udp_port}'
                                        value: `aoc-udp:${udpPort}`
                                    },
                                    {
                                        name: 'AWS_XRAY_DAEMON_ADDRESS',
                                        //value: '${kubernetes_service.aoc_udp_service[0].metadata[0].name}:${var.aoc_service.udp_port}'
                                        value: `aoc-udp:${udpPort}`
                                    },
                                    {
                                        name: 'AWS_REGION',
                                        //value: var.region
                                        value: props.region
                                    },
                                    {
                                        name: 'INSTANCE_ID',
                                        // value: var.testing_id
                                        value: '1'
                                    },
                                    {
                                        name: 'OTEL_RESOURCE_ATTRIBUTES',
                                        // value: 'service.namespace=${var.sample_app.metric_namespace},service.name=${var.aoc_service.name}'
                                        value: 'service.namespace=aws-otel,service.name=aws-otel-integ-test'
                                    },
                                    {
                                        name: 'LISTEN_ADDRESS',
                                        //value: '${var.sample_app.listen_address_ip}:${var.sample_app.listen_address_port}'
                                        value: `0.0.0.0:${listenAddressPort}`
                                    },
                                    {
                                        name: 'JAEGER_RECEIVER_ENDPOINT',
                                        // value: '${kubernetes_service.aoc_tcp_service[0].metadata[0].name}:${var.aoc_service.http_port}'
                                        value: `aoc-tcp:${httpPort}`
                                    },
                                    {
                                        name: 'ZIPKIN_RECEIVER_ENDPOINT',
                                        // value: '${kubernetes_service.aoc_tcp_service[0].metadata[0].name}:${var.aoc_service.http_port}'
                                        value: `aoc-tcp:${httpPort}`
                                    },
                                    {
                                        name: 'OTEL_METRICS_EXPORTER',
                                        value: 'otlp'
                                    }
                                ] ,

                                resources: {
                                    limits: {
                                        cpu: '0.2',
                                        memory: '256Mi'
                                    }
                                },

                                readinessProbe: {
                                    httpGet: {
                                        path: '/',
                                        //port: var.sample_app.listen_address_port
                                        port: listenAddressPort
                                    },
                                    initialDelaySeconds: 10,
                                    periodSeconds: 5
                                }
                            }
                        ]
                    }
                }
            }
        }
      
        this.pushModeSampleAppDeployment = props.cluster.addManifest('push-mode-sample-app-deployment', pushModeSampleAppDeploymentManifest)
    }
}

export interface PushModeSampleAppDeploymentConstructProps {
      cluster: ICluster;
      namespaceName: string
      sampleAppLabelSelector: string
      sampleAppImageURL: string
      region: string
      grpcServiceName: string
      grpcPort: number
}