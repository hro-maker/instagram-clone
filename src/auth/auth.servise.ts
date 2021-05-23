import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user';
import { logindto, loginresponse, registerdto } from './../dtos/authdto';
import * as bcrypt from 'bcrypt';
import { FileServise, FileType } from 'src/file/file.servise';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Post, PostDocument } from 'src/models/post';
dotenv.config();

@Injectable()
export class Authprovider {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
   
    private fileservise: FileServise,
  ) {}
  async register(dto: registerdto, files: Array<any>): Promise<User> {
    try {
      const canditate = await this.userModel.findOne({ email: dto.email });
      if (canditate) {
        throw new BadRequestException('user already registred');
      }
      dto.password = await bcrypt.hash(dto.password, 12);
      let avatar = '';
      if (files) {
          avatar = this.fileservise.createFile(FileType.IMAGE,files[0])
      }
      const user ={ ...dto, avatar };
      const newuser = await this.userModel.create(user);
      return newuser;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async login(dto: logindto):Promise<loginresponse> {
    try {
      const user = await  this.userModel.findOne({ email: dto.email }).populate('posts',"imageUrl _id")
      if (!user) {
        throw new BadRequestException('user dont found');
      }
      const validpassword = await bcrypt.compare(dto.password, user.password);
      if (!validpassword) {
        throw new BadRequestException('incorrect password');
      }
      const token = jwt.sign(
        { username: user.name, id: user._id, avatar: user.avatar },
        process.env.JWT_SECRET,
        {  expiresIn: '1h' }
      );
      return {token,user};
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
async updateprofile(dto:any,file,id){
  try {
    let user=await this.userModel.findOne({_id:id})
    if (file) {
        if(user.avatar.length > 1){
            this.fileservise.removeFile(user.avatar)
        }
     let newavatar = this.fileservise.createFile(FileType.IMAGE,file.foto[0])
      dto.avatar=newavatar
    }
    const olduser=JSON.parse(JSON.stringify({...user}))._doc
    const newuserr={...olduser,...dto}
  await this.userModel.findByIdAndUpdate({_id:user._id},newuserr)
  return newuserr
  return 
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
  }
}
