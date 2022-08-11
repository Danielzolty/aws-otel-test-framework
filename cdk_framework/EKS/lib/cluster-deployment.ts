#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { schemaValidator} from './utils/validate-cluster-config';
import { VPCStack } from './stacks/vpc-stack';
import { aws_eks as eks} from 'aws-cdk-lib';
import { readFileSync} from 'fs';
import { EC2Stack } from './stacks/ec2-cluster-stack';
import { FargateCluster } from 'aws-cdk-lib/aws-eks';
import { FargateStack } from './stacks/fargate-cluster-stack';
const yaml = require('js-yaml')


export function deployClusters(app: cdk.App) : Map<string, FargateStack | EC2Stack> {
    const REGION = process.env.REGION || 'us-west-2'

    const route = process.env.CDK_CONFIG_PATH ||  __dirname + '/config/cluster-config/clusters.yml';

    if (!/(.yml|.yaml)$/.test(route)){
      throw new Error ('Path for cluster configuration must be to a yaml file')
  }

    const raw = readFileSync(route)
    const configData = yaml.load(raw)

    const eksClusterMap = new Map<string, FargateStack | EC2Stack>();
    
    const vpcStack = new VPCStack(app, 'EKSVpc', {
      env: {
        region: REGION
      }
    })

    schemaValidator(configData)
    for(const cluster of configData['clusters']){
      const versionKubernetes = eks.KubernetesVersion.of(String(cluster['version']));
      let stack;
      if(String(cluster['launch_type']) === 'ec2'){
        stack = new EC2Stack(app, cluster['name'] + 'EKSCluster', {
          name: String(cluster['name']),
          vpc: vpcStack.vpc,
          version: versionKubernetes,
          ec2_instance:  String(cluster['ec2_instance']),
          node_size:  String(cluster['node_size']),
          env: {
            region: REGION
          },
        })
      } else {
        stack = new FargateStack(app, cluster['name'] + 'EKSCluster', {
          name: String(cluster['name']),
          vpc: vpcStack.vpc,
          version: versionKubernetes,
          env: {
            region: REGION
          },
        })
      }
      eksClusterMap.set(cluster['name'], stack)
    }

    return eksClusterMap
}
