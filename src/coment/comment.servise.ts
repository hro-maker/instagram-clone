import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Coment, ComentDocument } from "src/models/comentschema";
import { Events, EventsDocument } from "src/models/events";
import { Post, PostDocument } from "src/models/post";
import { User, UserDocument } from "src/models/user";
import { createcomentdto } from './../dtos/commentdtos';


@Injectable()
export class Commentservise{
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Coment.name) private comentmodel: Model<ComentDocument>,
        @InjectModel(Events.name) private eventsmodel: Model<EventsDocument>,
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
            const text=coment.text
            const post =await this.postModel.findOne({_id:postId})
            post.coments=post.coments.filter((el)=>String(el) != String(coment._id))
            await post.save()
            await this.comentmodel.findOneAndDelete({_id:coment._id})
            await this.eventsmodel.findOneAndDelete({
                subject:userId,
                object:post.user,
                post:post._id,
                comment:text
            }).catch((err)=>{
                console.log(err)
            })
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

    async togglecommentlike(comentId:string,userId){
        try {
          const coment=await this.comentmodel.findOne({_id:comentId}).populate("userId"," name surename avatar _id")
          if(!coment.likes.includes(userId)){
              coment.likes.push(userId)
          }else{
               coment.likes=coment.likes.filter((el)=>el != userId) 
          }
          await coment.save()
          return coment
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
}
async getlikesbycommentId(commentId:string){
    const post=await this.comentmodel.findOne({_id:commentId}).populate("likes","avatar surename name _id")
    return post.likes
}
}
