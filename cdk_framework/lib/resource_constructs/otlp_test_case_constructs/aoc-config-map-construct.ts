import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../universal_constructs/namespace-construct';


export class AOCConfigMapConstruct extends Construct {
        name: string
        aocConfigPath: string
        aocConfigMap: Construct

        constructor(scope: Construct, id: string, props: AOCConfigMapConstructProps) {
            super(scope, id);
            this.name = 'aoc-config-map'
            
            const aocConfigMapManifest = {
                apiVersion: 'v1',
                kind: 'ConfigMap',

                metadata: {
                    name: this.name,
                    namespace: props.namespaceConstruct.name
                },
                
                data: {
                    'aoc-config.yml': JSON.stringify(props.aocConfig)
                },

                // depends_on: [aws_eks_fargate_profile.test_profile]
            }

            this.aocConfigPath = Object.keys(aocConfigMapManifest['data'])[0]
            this.aocConfigMap = props.cluster.addManifest(this.name, aocConfigMapManifest)
            this.aocConfigMap.node.addDependency(props.namespaceConstruct.namespace)
        }
}

export interface AOCConfigMapConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
    aocConfig: Object
}