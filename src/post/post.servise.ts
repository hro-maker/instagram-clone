import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { updatepostdto } from 'src/dtos/postdto';
import { FileServise, FileType } from 'src/file/file.servise';
import { Post, PostDocument } from 'src/models/post';
import { User, UserDocument } from 'src/models/user';
interface createdto {
  description: string;
  userId: any;
}
@Injectable()
export class postservise {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileservise: FileServise,
  ) {}
  async create(dto: createdto, files: any) {
    try {
        if (typeof files.foto === 'undefined') {
            throw new HttpException('image is required', HttpStatus.BAD_REQUEST);
          }
          const imageUrl = this.fileservise.createFile(FileType.IMAGE, files.foto[0]);
          const user=await this.userModel.findOne({_id:dto.userId})
          const post = await this.postModel.create({
            user: dto.userId,
            imageUrl,
            description: dto.description,
            createdAt:new Date(Date.now())
          })
          user.posts.push(post._id)
          await user.save()
          const newpostt=await this.postModel.findOne({_id:post._id}).populate("user","avatar surename name _id")
          return newpostt;
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getall(){
    return await  this.postModel.find({}).populate("user")
  }
  async removeall(){
    await this.userModel.remove({})
    await this.postModel.remove({})
    return []
  }
  async getbyId(id:any){
    return await  this.postModel.findOne({_id:id}).populate("user","avatar surename name _id")
  }
  async updatedescription(dto:updatepostdto,userId:any):Promise<Post>{
  try {
    const post:any= await this.postModel.findOne({_id:dto.id}).populate("user","avatar surename name _id")
    if(String(post.user._id) != String(userId)){
     throw new HttpException("action dont alloed", HttpStatus.BAD_REQUEST);
    }
    post.description=dto.description;
    post.updatedAt=new Date(Date.now())
    await post.save()
    return post
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
  }

  async togglepostlike(postId:string,userId){
          try {
            const post=await this.postModel.findOne({_id:postId}).populate("user"," name surename avatar _id")
            if(!post.likes.includes(userId)){
                post.likes.push(userId)
            }else{
                 post.likes=post.likes.filter((el)=>el != userId) 
            }
            await post.save()
            return post
          } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          }
  }

  async getlikesbypostId(postId:string){
      const post=await this.postModel.findOne({_id:postId}).populate("likes","avatar surename name _id")
      return post.likes
  }
  async deletepost(postId):Promise<boolean>{
      try {
        console.log("hello")
        const post=await this.postModel.findOne({_id:postId})
      this.fileservise.removeFile(post.imageUrl)
      await this.postModel.findOneAndDelete({_id:postId})
      return true
      } catch (error) {
          return false
      }
  }
}
