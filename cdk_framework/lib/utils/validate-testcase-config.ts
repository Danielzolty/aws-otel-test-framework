import { ClusterStack } from '../stacks/cluster-stack';

const configKeys = new Set(['clusterName', 'baseScenario', 'aocConfig'])

export function validateTestcaseConfig(info: Object, clusterStackMap: Map <string, ClusterStack>){
    const data = Object(info)
    if (!data['testcase']) {
        throw new Error('No testcase field in the yaml file')
    }
    const testCaseConfig = data['testcase']
    const providedKeys = new Set(Object.keys(testCaseConfig))

    // validate that all provided keys are valid
    providedKeys.forEach(key => {
        if (!configKeys.has(key)) {
            throw new Error(`Provided key ${key} is not valid`)
        }
    })

    // validate that all required keys are provided
    configKeys.forEach(key => {
        if (!providedKeys.has(key)) {
            throw new Error(`${key} must be specified`)
        }
    })

    // validate each key-value pair
    for (const [key, value] of Object.entries(testCaseConfig)) {
        validateValue(key, value, clusterStackMap)
    }
}

function validateValue(key: string, value: any, clusterStackMap: Map <string, ClusterStack>) {
    if (value == undefined) {
        throw Error(`No value provided for key ${key}`)
    }
    switch (key){
        case 'clusterName':
            if (clusterStackMap.get(value) == undefined) {
                throw Error(`Cluster name ${value} does not reference an existing cluster`)
            }
            break
        case 'baseScenario':
            if (value !== 'otlp' && value !== 'prometheus'){
                throw new Error(`baseCase must have value "otlp" or "prometheus", "${value}" is invalid`)
            }
            break
    }
}
