const validateSchema = require('yaml-schema-validator')

const supportedLaunchTypes = new Set(['fargate', 'ec2'])
const supportedVersions = new Set(['1.18', '1.19', '1.20', '1.21']);
const supportedCPUArchitectures = new Set(['m5', 'm6g', 't4g']);

const requiredSchema = {
    name: {
        type : String,
        required: true
    },
    version: {
        type : String,
        required: true,
        use: {validateVersion}
    },
    launch_type: {
        type: String,
        required: true, 
        use: {checkLaunchType}
    },
    ec2_instance: {
        type: String,
        use: {validateEC2Instance}
    },
    node_size: {
        type: String
    }
  }

function checkLaunchType(val: string) {
    const adjustedType = val.toLowerCase()
    if(!supportedLaunchTypes.has(adjustedType)){
        throw new Error("Wrong type")
    }
    return adjustedType
}

function validateVersion(version: string){
    if(!supportedVersions.has(version)){
        throw new Error('Version needs to be a value of one of the following: ' + Array.from(supportedVersions).join(', '));
    }
    return version
}

function validateEC2Instance(instance: string){
    const adjustedType = instance.toLowerCase()
    if(!supportedCPUArchitectures.has(adjustedType)){
        throw new Error('Improper instance type or provided faulty ec2_instance/node_size for fargate cluster')
    }
return adjustedType
}

export function schemaValidator(info: unknown){
    const data = Object(info)
    if(!data['clusters']){
        throw new Error('No clusters field being filed in the yaml file')
    }
    const clusterInfo = data['clusters']
    for(const name of clusterInfo){
        const validationErrors = validateSchema(name, { schema: requiredSchema })
        if(Object.entries(validationErrors).length > 0){
            throw new Error("There was an error")
        }
    }
}
