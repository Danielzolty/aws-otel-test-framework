import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AOCNamespaceConstruct } from './aoc-namespace-construct';


export class MockedServerCertConstruct extends Construct{
    name : string

    constructor(scope: Construct, id: string, props: MockedServerCertConstructProps) {
        super(scope, id);

        this.name = 'mocked-server-cert'
        const mockedServerCertManifest = {
          apiVersion: 'v1',

          metadata: {
            name: this.name,
            namespace: props.aocNamespaceConstruct.name,
          },
        
          data: {
            "ca-bundle.crt": module.basic_components.0.mocked_server_cert_content
          },
          
          depends_on: [aws_eks_fargate_profile.test_profile]
        }

        props.cluster.addManifest(mockedServerCertManifest)
    }
}

export interface MockedServerCertConstructProps {
    cluster: eks.ICluster;
    aocNamespaceConstruct: AOCNamespaceConstruct
}