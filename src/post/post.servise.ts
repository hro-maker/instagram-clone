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
          });
          await post.populate("user")
          user.posts.push(post._id)
          await user.save()
          return post;
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getall(){
    await this.userModel.remove({})
    await this.postModel.remove({})
    return await  this.postModel.find({}).populate("user")
  }
  async getbyId(id:any){
    return await  this.postModel.findOne({_id:id}).populate("user","avatar name _id")
  }
  async updatedescription(dto:updatepostdto,userId:any):Promise<Post>{
  try {
    const post= await this.postModel.findOne({_id:dto.id})
    if(post.user != userId){
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
            const post=await this.postModel.findOne({_id:postId})
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

}
