import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from './namespace-construct';


export class AOCConfigMapConstruct extends Construct {
        name: string
        aocConfigPath: string
        aocConfigMap: Construct

        constructor(scope: Construct, id: string, props: AOCConfigMapConstructProps) {
            super(scope, id);

            //TODO: Figure out how to set the key in data to the aocConfigPath Variable
            // For now just assert that they're the same
            props.aocConfigPath = 'aoc-config.yml'
            if (props.aocConfigPath !== 'aoc-config.yml') {
                throw new Error('Config path must be set to "aoc-config.yml"');
            }
            
            const aocConfigMapManifest = {
                apiVersion: 'v1',
                kind: 'ConfigMap',

                metadata: {
                    name: props.name,
                    namespace: props.namespaceConstruct.name
                },
                
                data: {
                    'aoc-config.yml': JSON.stringify(props.aocConfig)
                },

                // depends_on: [aws_eks_fargate_profile.test_profile]
            }
            
            this.name = props.name
            this.aocConfigPath = props.aocConfigPath
            this.aocConfigMap = props.cluster.addManifest(props.name, aocConfigMapManifest)
            this.aocConfigMap.node.addDependency(props.namespaceConstruct.namespace)
        }
}

export interface AOCConfigMapConstructProps {
    cluster: ICluster
    name: string
    namespaceConstruct: NamespaceConstruct
    aocConfigPath: string
    aocConfig: Object
}