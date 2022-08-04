import { Construct } from 'constructs';
import { Cluster, FargateCluster } from 'aws-cdk-lib/aws-eks';
import { NamespaceConstruct } from '../basic_constructs/namespace-construct';


export class MockedServerCertConstruct extends Construct {
    mockedServerCert: Construct

    constructor(scope: Construct, id: string, props: MockedServerCertConstructProps) {
        super(scope, id);

        const mockedServerCertManifest = {
            apiVersion: 'v1',

            metadata: {
                name: 'mocked-server-cert',
                namespace: props.namespaceConstruct.name,
            },
        
            data: {
                'ca-bundle.crt': module.basic_components.0.mocked_server_cert_content
            },
          
            // depends_on: [aws_eks_fargate_profile.test_profile]
        }

        this.mockedServerCert = props.cluster.addManifest('mocked-server-cert', mockedServerCertManifest)
    }
}

export interface MockedServerCertConstructProps {
    cluster: Cluster | FargateCluster
    namespaceConstruct: NamespaceConstruct
}