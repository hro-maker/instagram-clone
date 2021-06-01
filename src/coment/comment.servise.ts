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
        const post=await this.postModel.findOne({_id:dto.postId}).populate("user"," name surename avatar _id")
        if(!post){
            throw new BadRequestException("post dont found")
        }
        const coment=await this.comentmodel.create({...dto,userId,createdAt:new Date(Date.now())})   
        post.coments.push(coment._id)
        await post.save()
        return {post,coment}
       } catch (error) {
        throw new BadRequestException(error.message)
       }         
    }
    async deletecoment(comentId,postId,userId){
           try {
            const coment=await this.comentmodel.findOne({_id:comentId})
            if(!coment){
                throw new BadRequestException("coment dont found")
            }
            if(coment.userId != userId){
                throw new BadRequestException("action dont alloed")
            }
            const post =await this.postModel.findOne({_id:postId})
            console.log("aaaaaaaaa",post.coments,coment._id)
            post.coments=post.coments.filter((el)=>String(el) != String(coment._id))
            console.log("ssssss",post.coments)
            await post.save()
            await this.comentmodel.findOneAndDelete({_id:coment._id})
            return {message:"coment deleted"}
           } catch (error) {
            throw new BadRequestException(error.message)
           }
    }
    async comentsbypostid(postId){
       try {
        const coments=await this.comentmodel.find({postId}).populate('userId','name surename _id avatar')
        console.log(coments)
        return coments
       } catch (error) {
           console.log(error.message)
       }
    }
}
