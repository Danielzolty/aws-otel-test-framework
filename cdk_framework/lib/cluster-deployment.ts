#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { validateClusterConfig } from './utils/validate';
import { VPCStack } from './stacks/vpc-stack';
import { aws_eks as eks } from 'aws-cdk-lib';
import { ClusterStack } from './stacks/cluster-stack';
import { readFileSync } from 'fs';
const yaml = require('js-yaml')


export function deployClusters(app: cdk.App) : Map <string, ClusterStack> {
    // get the file
    const clusterConfigRoute = process.env.CLUSTER_CONFIG_PATH
    // if no cluster config path is provided, throw error
    if (clusterConfigRoute == undefined){
        throw new Error ('No path provided for cluster configuration')
    }
    // if cluster config path doesn't route to a yaml file, throw error
    if (!/(.yml|.yaml)$/.test(clusterConfigRoute)){
        throw new Error ('Path for cluster configuration must be to a yaml file')
    }

    // load the data from the file
    const rawClusterConfig = readFileSync(clusterConfigRoute)
    const clusterConfigData = yaml.load(rawClusterConfig)
    validateClusterConfig(clusterConfigData)

    // set up VPC to be used by all EKS clusters
    const region = process.env.REGION
    if (region == undefined) {
        throw new Error ('Region environment variable not set')
    }
    const vs = new VPCStack(app, 'EKS-VPC-stack', {
        env: {
            region: region
        }
    })

    // deploy clusters
    const clusterStackMap = new Map <string, ClusterStack>()
    for (const [key, value] of Object.entries(clusterConfigData['clusters'])) {
        const val = Object(value)
        const kubernetesVersion = eks.KubernetesVersion.of(String(val['version']));
        const newStack = new ClusterStack(app, `${key}-stack`, {
            launchType: String(val['launch_type']),
            name: key,
            vpc: vs.vpc,
            version: kubernetesVersion,
            cpu: String(val['cpu_architecture']),
            nodeSize: String(val['node_size']),
            env: {
                region: region
            }
        })
        clusterStackMap.set(key, newStack)
    }
    return clusterStackMap
}