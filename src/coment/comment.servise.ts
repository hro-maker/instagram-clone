import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Coment, ComentDocument } from "src/models/comentschema";
import { Post, PostDocument } from "src/models/post";
import { User, UserDocument } from "src/models/user";
import { createcomentdto } from './../dtos/commentdtos';


@Injectable()
export class Commentservise{
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Coment.name) private comentmodel: Model<ComentDocument>,
      ) {}
    async createcomment(dto:createcomentdto,userId:any){
       try {
        const post=await this.postModel.findOne({_id:dto.postId})
        if(!post){
            throw new BadRequestException("post dont found")
        }
        const coment=await this.comentmodel.create({...dto,userId})   
        post.coments.push(coment._id)
        await post.save()
        return coment
       } catch (error) {
        throw new BadRequestException(error.message)
       }         
    }
}
