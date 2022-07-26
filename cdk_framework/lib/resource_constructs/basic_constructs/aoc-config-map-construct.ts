import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';
import { print } from 'util';


export class AOCConfigMapConstruct extends Construct {
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
                    namespace: props.namespaceName
                },
                
                data: {
                    'aoc-config.yml': JSON.stringify(props.aocConfig)
                },

                // depends_on: [aws_eks_fargate_profile.test_profile]
            }
            
            this.aocConfigMap = props.cluster.addManifest('aoc-config-map', aocConfigMapManifest)
        }
}

export interface AOCConfigMapConstructProps {
        cluster: ICluster
        name: string
        namespaceName: string
        aocConfigPath: string
        aocConfig: Object
}