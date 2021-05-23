import { Injectable, Post, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileServise, FileType } from 'src/file/file.servise';
import { PostDocument } from 'src/models/post';
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
          console.log(user)
          return post;
    } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getall(){
    return await  this.postModel.find({})
  }
}
