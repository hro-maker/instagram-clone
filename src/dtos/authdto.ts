
import { User } from 'src/models/user';

export class registerdto{
    email:string
    password:string
    name:string
    surename:string
}
export class logindto{
    email:string
    password:string
}
export interface loginresponse{
    token:string,
    user:User
}