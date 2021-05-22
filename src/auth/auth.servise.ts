import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user';
import { registerdto } from './../dtos/authdto';
import * as bcrypt from 'bcrypt';
import { FileServise } from 'src/file/file.servise';

@Injectable()
export class Authprovider {
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private fileservise:FileServise
      ) {}
  async register(dto: registerdto, files: Array<any>) {
    const canditate = await this.userModel.findOne({ email: dto.email });
    if (canditate) {
      throw new BadRequestException('user already registred');
    }
    dto.password=await bcrypt.hash(dto.password,12)
    let avatar=''
    if(files){
       avatar =this.fileservise.create(files[0])
    }
    const user={...dto,avatar,images:[avatar]}
    const newuser=await this.userModel.create(user)

    return newuser;
  }
}
