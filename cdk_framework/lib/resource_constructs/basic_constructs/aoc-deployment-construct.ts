import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCConfigMapConstruct } from './aoc-config-map-construct';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';
import { MockedServerCertConstruct } from './mocked-server-cert-construct';
import { SampleAppDeploymentConstruct } from './sample-app-deployment-construct';
import { AOCRoleConstruct } from './aoc-role-construct';

export class AOCDeploymentConstruct extends Construct {
    aocDeployment: Construct

    constructor(scope: Construct, id: string, props: AOCDeploymentConstructProps) {
        super(scope, id);

        const aocConfigMountPath = '/aoc'
        const aocDeploymentManifest = {
            apiVersion: 'apps/v1',
            kind: 'Deployment',

            metadata: {
                name: 'aoc',
                //namespace: var.deployment_type == 'fargate' ? tolist(aws_eks_fargate_profile.test_profile[count.index].selector)[0].namespace : kubernetes_namespace.aoc_ns.metadata[0].name,
                namespace: props.namespaceName,
                labels: {
                    app: 'aoc'
                }
            },
            
            spec: {
                replicas: 1,
            
                selector: {
                    matchLabels: {
                        // app: local.sample_app_label_selector
                        app: props.aocLabelSelector
                    }
                },
            
                template: {
                    metadata: {
                        labels: {
                            // app: local.sample_app_label_selector
                            app: props.aocLabelSelector
                        }
                    },
            
                    spec: {
                        // serviceAccountName: 'aoc-role-${module.common.testing_id}',
                        serviceAccountName: props.aocRoleName,
                        automountServiceAccountToken: true,
                        
                        volumes: [
                            {
                                // in the old framework the name was hardcoded to otel-config (as well as below in the volumeMounts)
                                // and only the name in the config map accessed a variable which ended up being the same name
                                // I think it's simpler to just set both to the variable
                                name: props.aocConfigMapName,
                                configMap: {
                                    // name: kubernetes_config_map.aoc_config_map.0.metadata[0].name
                                    //Using a hard-coded name ultimately from otlp.tf
                                    name: props.aocConfigMapName
                                }
                            },

                            // {
                            //     // in the old framework the name was hardcoded to otel-config (as well as below in the volumeMounts)
                            //     // and only the name in the config map accessed a variable which ended up being the same name
                            //     // I think it's simpler to just set both to the variable
                            //     name: props.mockedServerCertConstruct.name,
                            //     configMap: {
                            //         // name: kubernetes_config_map.mocked_server_cert.0.metadata[0].name
                            //         //Using a hard-coded name ultimately from otlp.tf
                            //         name: props.mockedServerCertConstruct.name
                            //     }
                            // }
                        ],

                        containers: [
                            // {
                            //     name: 'mocked-server',
                            //     image: local.mocked_server_image,
                            //     image: "${data.aws_ecr_repository.mocked_servers.repository_url}:${var.mocked_server}-latest",
                            //     imagePullPolicy: 'Always',
                        
                            //     readinessProbe: {
                            //         httpGet: {
                            //             path: '/',
                            //             port: 8080
                            //         },
                            //         initialDelaySeconds: 10,
                            //         periodSeconds: 5
                            //     }
                            // },
                            {
                                name: 'aoc',
                                //image: module.common.aoc_image,
                                // from outputs.tf -> common.tf
                                image: 'public.ecr.aws/aws-otel-test/adot-collector-integration-test:latest',
                                imagePullPolicy: 'Always',
                                args: [
                                `--config=${aocConfigMountPath}/${props.aocConfigPath}`],
                        
                                resources: {
                                    limits: {
                                        cpu: '0.2',
                                        memory: '256Mi'
                                    }
                                },

                                volumeMounts: [
                                    {
                                        mountPath: aocConfigMountPath,
                                        name: props.aocConfigMapName
                                    }
                                    // {
                                    //     mountPath: '/etc/pki/tls/certs',
                                    //     name: props.mockedServerCertConstruct.name
                                    // }
                                ]
                            }
                        ]
                    }
                }
            },

            //dependsOn: [aws_eks_fargate_profile.test_profile]
        }
        
        this.aocDeployment = props.cluster.addManifest('aoc-deployment', aocDeploymentManifest)
    }
}

export interface AOCDeploymentConstructProps {
    cluster: ICluster
    namespaceName: string
    aocLabelSelector: string
    aocRoleName: string
    aocConfigMapName: string
    aocConfigPath: string
    // mockedServerCertConstruct: MockedServerCertConstruct
}