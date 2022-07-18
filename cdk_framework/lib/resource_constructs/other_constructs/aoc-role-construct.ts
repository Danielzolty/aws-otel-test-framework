import { aws_eks as eks} from 'aws-cdk-lib';
import { Construct } from 'constructs';


export class aocRoleConstruct extends Construct{
    constructor(scope: Construct, id: string, props: aocRoleConstructProps){
        super(scope, id);
        
    }
}

export interface aocRoleConstructProps {
    cluster: eks.ICluster;
}