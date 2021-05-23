import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user';
import {
  logindto,
  loginresponse,
  registerdto,
  registerresponse,
} from './../dtos/authdto';
import * as bcrypt from 'bcrypt';
import { FileServise, FileType } from 'src/file/file.servise';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { Post, PostDocument } from 'src/models/post';
import * as nodemailer from 'nodemailer';
dotenv.config();
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'hrantmuradyan137@gmail.com',
      pass: 'lyveokznvxckyhgc',
    },
  });
} catch (error) {
  console.log('errrrrrrrrrrrrrrrrrror', error.message);
}

const randomnumbers = () => {
  return Math.floor(Math.random() * 9001 + 1000);
};
@Injectable()
export class Authprovider {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private fileservise: FileServise,
  ) {}
  async register(
    dto: registerdto,
    files: Array<any>,
  ): Promise<registerresponse> {
    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      const canditate = await this.userModel.findOne({ email: dto.email });
      if (canditate) {
        if (canditate.confirm.length > 0) {
          let code = String(randomnumbers());
          transporter.sendMail({
            to: canditate.email,
            from: 'intagramm',
            subject: 'password confirm',
            html: `
              <p> for email confir please wread your email and ${code}</p> 
          `,
          });
          canditate.confirm = code;
          await this.userModel.findByIdAndUpdate(
            { _id: canditate._id },
            canditate,
          );
          return { message: 'please check your email ' };
        } else {
          return { message: 'user already reagistret' };
        }
      }
      dto.password = await bcrypt.hash(dto.password, 12);
      let avatar = '';
      if (files) {
        avatar = this.fileservise.createFile(FileType.IMAGE, files[0]);
      }
      let code = String(randomnumbers());
      const user = { ...dto, avatar, confirm: code };
      try {
        transporter.sendMail({
          to: user.email,
          from: 'intagramm',
          subject: 'password confirm',
          html: `
            <p> for email confir please wread your email and ${code}</p> 
        `,
        });
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      await this.userModel.create(user);
      return { message: 'please enter your email and confirm code' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async login(dto: logindto): Promise<loginresponse> {
    try {
      const user = await this.userModel
        .findOne({ email: dto.email })
        .populate('posts', 'imageUrl _id');
      if (!user) {
        throw new BadRequestException('user dont found');
      }
      // if (user.confirm.length > 0) {
      //   throw new BadRequestException('before login please confirm your email');
      // }
      const validpassword = await bcrypt.compare(dto.password, user.password);
      if (!validpassword) {
        throw new BadRequestException('incorrect password');
      }
      const token = jwt.sign(
        {
          username: user.name,
          id: user._id,
          avatar: user.avatar,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      return { token, user };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateprofile(dto: any, file, id) {
    try {
      let user = await this.userModel.findOne({ _id: id });
      if (file.foto) {
        if (user.avatar.length > 1) {
          this.fileservise.removeFile(user.avatar);
        }
        let newavatar = this.fileservise.createFile(
          FileType.IMAGE,
          file.foto[0],
        );
        dto.avatar = newavatar;
      }
      const olduser = JSON.parse(JSON.stringify({ ...user }))._doc;
      const newuserr = { ...olduser, ...dto };
      await this.userModel.findByIdAndUpdate({ _id: user._id }, newuserr);
      return newuserr;
      return;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async emailconfirm(email: any, code: string) {
    const user = await this.userModel.findOne({ email });
    if (user.confirm.length > 0 && user.confirm === code) {
      user.confirm = '';
      await this.userModel.findOneAndUpdate({ email }, user);
      return {
        message: 'email confirmed',
      };
    } else {
      return {
        message: 'email already confirmed if you forget password can reset',
      };
    }
  }
}
