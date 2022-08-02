const supportedFields = new Set(['version', 'ec2_instance', 'launch_type', 'node_size'])
const supportedVersions = new Set(['1.18', '1.19', '1.20', '1.21']);
const supportedCPUArchitectures = new Set(['m5', 'm6g', 't4g']);
const supportedNodeSizes = new Set(['medium', 'large', 'xlarge', '2xlarge', '4xlarge', '8xlarge', '12xlarge', '16xlarge', '24xlarge', 'metal']);
const supportedT4gInstances = new Set(['nano', 'micro', 'small', 'medium', 'large', 'xlarge', '2xlarge'])
const requiredFields = new Set(['version', 'launch_type'])


export function validateClustersConfig(info: unknown){
    const data = Object(info)
    if(!data['clusters']){
        throw new Error('No clusters field being filed in the yaml file')
    }
    const clusterInfo = data['clusters']
    const clusterNamesSet = new Set()
    for(const [key, value] of Object.entries(clusterInfo)){
        if(Object.keys(Object(value)).length !== 2){
            throw new Error("Didn't use proper fields for cluster. You can only have launch_type and version")
        }
        const val = Object(value)
        if(clusterNamesSet.has(key)){
            throw new Error('Cannot have multiple clusters with the samne name')
        }
        clusterNamesSet.add(key)
        validateRequiredFields(val)
        for(const [k, v] of Object.entries(val)){
            if(!supportedFields.has(k)){
                throw new Error("Incompatible field type")
            }
            switch(k){
                case 'version':
                    val[k] = validateVersion(String(v))
                    break;
                case 'launch_type':
                    val[k] = convertAndValidateLaunchType(val)
                    break
            }
        }
    }
}

function validateRequiredFields(fields: any){
    for(const field of requiredFields){
        if(!fields[field]){
            throw new Error('Required field - ' + field + ' - not provided')
        }
    }
}

function checkToSetUpDefaults(fields: any){
    if(!fields['ec2_instance']){
        fields['ec2_instance'] = 'm5'
    }
    if(!fields['node_size']){
        fields['node_size'] = 'large'
    }
}

function validateVersion(version: string){
    
    if(version === '1.2'){
        version = '1.20'
    }

    if(!supportedVersions.has(version)){
        throw new Error('Version needs to be a value of one of the following: ' + Array.from(supportedVersions).join(', '));
    }
    return version
}

function convertAndValidateEC2Instance(instance: string){
    if(instance === null || !instance || instance == 'null'){
        throw new Error('EC2 instance type was not provided for ec2 cluster')
    }
    const adjustedType = instance.toLowerCase()
    if(!supportedCPUArchitectures.has(adjustedType)){
        throw new Error('Improper instance type or provided faulty ec2_instance/node_size for fargate cluster')
    }
    return adjustedType
}

function convertAndValidateLaunchType(type: any){
    const launchType = Object(type['launch_type'])
    if(Object.keys(launchType).length != 1){
        throw new Error("More than 1 launch_type provided or none provided")
    }
    if(launchType['fargate'] !== undefined){
        return launchType
    } else if(launchType['ec2'] !== undefined){
        const launchData = Object(launchType['ec2'])
        checkToSetUpDefaults(launchData)
        for(const [k, v] of Object.entries(launchData)){
            if(!supportedFields.has(k)){
                throw new Error('Provided field type, ' + k + ', is not a compatible field type')
            }
            switch(k){
                case 'ec2_instance':
                    launchData[k] = convertAndValidateEC2Instance(String(v))
                    break
                case 'node_size':
                    launchData[k] = validateNodeSize(String(v), String(launchData['ec2_instance']))
                    break;
            }
        }
        launchType['ec2'] = launchData
        addedChecks(launchData)
        return launchType
    } else {
        throw new Error('launch_type is neither ec2 nor fargate')
    }
}

function validateNodeSize(size: string, instance: string){
    if(!size || size === null || size === 'null' || size === ''){
        return null
    }
    const adjustedSize = size.toLowerCase()
    const adjustedInstance = convertAndValidateEC2Instance(instance)

    if(adjustedInstance === 't4g'){
        if(!supportedT4gInstances.has(adjustedSize)){
            throw new Error('Node size is not one of the options listed here https://www.amazonaws.cn/en/ec2/instance-types/')
        }
    } else {
        if(!supportedNodeSizes.has(adjustedSize)){
            throw new Error('Node size is not one of the options listed here https://www.amazonaws.cn/en/ec2/instance-types/')
        }
    }
    
    return adjustedSize

}

function addedChecks(val: unknown){
    const value = Object(val)
    if(!supportedCPUArchitectures.has(String(value['ec2_instance']))){
        throw new Error('ec2 type needs to have cpu architecture type')
    }
    if(String([value['ec2_instance']]) === 'm6g' && String([value['node_size']]) === '24xlarge'){
        throw new Error("CPU Architecture and node size aren't compatible")
    }

    if(String([value['ec2_instance']]) === 'm5' && String([value['node_size']]) === 'medium'){
        throw new Error("CPU architecture and node size aren't compatible")
    }
    if(String([value['ec2_instance']]) === 'm6g' && String([value['node_size']]) === '24xlarge'){
        throw new Error("CPU architecture and node size aren't compatible")
    }
}

