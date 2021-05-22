import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "src/models/user";
import { registerdto } from './../dtos/authdto';

@Injectable()
export class Authprovider{
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}
    async register(dto:registerdto,file:any){
      
        console.log(dto,file)
            return "hello"
     }
}