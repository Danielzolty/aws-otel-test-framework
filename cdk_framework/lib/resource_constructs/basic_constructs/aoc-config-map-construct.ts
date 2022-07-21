import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';


export class AOCConfigMapConstruct extends Construct{
        name : string

        constructor(scope: Construct, id: string, props: AOCConfigMapConstructProps) {
                super(scope, id);

                this.name = 'otel-config'
                //convert aocConfig mapping to string in YAML format
                console.log(this.convertToYAMLString(props.aocConfig))

                const aocConfigMapManifest = {
                        apiVersion: 'v1',
                        kind: 'ConfigMap',

                        metadata: {
                            name: this.name,
                            namespace: props.aocNamespaceConstruct.name
                        },
                        
                        data: {
                            //TODO: Need to convert to String
                            'aoc-config.yml': props.aocConfig
                        },

                        // depends_on: [aws_eks_fargate_profile.test_profile]
                }
                
                props.cluster.addManifest('aoc-config-map', aocConfigMapManifest)
        }

        convertToYAMLString(map: Object) {
            var yamlString = ''
            for (const [key, value] of Object.entries(map)){
                yamlString += `${key}: `
                if (typeof value === 'string') {
                    yamlString += value
                } else {
                    yamlString += this.convertToYAMLString(value)
                }
                yamlString += '\n'
            }
            return yamlString
        }
}

export interface AOCConfigMapConstructProps {
        cluster: ICluster
        aocNamespaceConstruct: AOCNamespaceConstruct
        //What type should this be?
        aocConfig: Object
}