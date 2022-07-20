import { Construct } from 'constructs';
import { ICluster } from 'aws-cdk-lib/aws-eks';


export class aocRoleConstruct extends Construct{
    constructor(scope: Construct, id: string, props: aocRoleConstructProps){
        super(scope, id);
        
    }
}

export interface aocRoleConstructProps {
    cluster: ICluster;
}