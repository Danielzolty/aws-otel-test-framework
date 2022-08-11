const validateSchema = require('yaml-schema-validator')

const supportedLaunchTypes = new Set(['fargate', 'ec2'])

const requiredSchema = {
    name: {
        type : String
    },
    version: {
        type : Number
    },
    launch_type: {
        type: String, 
        use: {checkLaunchType}
    },
    ec2_instance: {
        type: String
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

export function schemaValidator(info: unknown){
    const data = Object(info)
    if(!data['clusters']){
        throw new Error('No clusters field being filed in the yaml file')
    }
    const clusterInfo = data['clusters']
    for(const name of data['clusters']){
        validateSchema(name, { schema: requiredSchema })
    }
}
