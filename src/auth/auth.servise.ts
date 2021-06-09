import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/models/user';
import {
  changepassword,
  logindto,
  loginresponse,
  registerdto,
  registerresponse,
  resetpassword,
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

const randomnumbers = (max = 9001) => {
  return Math.floor(Math.random() * max + 1000);
};
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
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
          return {
            message: 'yor email not confirmet please check your email ',
          };
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
  async login(dto: logindto, res): Promise<loginresponse> {
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
      res.cookie('token', token, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        sameSite: 'strict',
        httpOnly: true,
      });
      return res.status(200).json({ token });
      // return { token, user };
    } catch (error) {
      return res.status(400).json(error.message);
      // throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async updateprofile(dto: any, file, id) {
    try {
      console.log(dto.name,file)
      let user = await this.userModel.findOne({ _id: id });
      if (file?.foto) {
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
    if (!user) {
      return {
        message: 'user dont found',
      };
    }
    if (user.confirm.length > 0 && user.confirm === code) {
      user.confirm = '';
      await this.userModel.findOneAndUpdate({ email }, user);
      return {
        message: 'email successfuly confirmed',
      };
    } else {
      return {
        message: 'email already confirmed if you forget password can reset',
      };
    }
  }
  async subscript(requesterId, subId): Promise<void> {
    try {
      const me = await this.userModel.findOne({ _id: requesterId });
      const other = await this.userModel.findOne({ _id: subId });
      me.Isub.push(other._id);
      other.otherSub.push(me._id);
      await me.save();
      await other.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async unSubscript(requesterId, subId): Promise<void> {
    try {
      const me = await this.userModel.findOne({ _id: requesterId });
      const other = await this.userModel.findOne({ _id: subId });
      me.Isub = me.Isub.filter((el) => String(el) != String(other._id));
      other.otherSub = other.otherSub.filter(
        (el) => String(el) != String(me._id),
      );
      await me.save();
      await other.save();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async me(userId) {
    return await this.userModel
      .findOne({ _id: userId })
      .populate('posts', 'imageUrl likes coments _id')
      .populate('Isub');
  }
  async getISubscripers(userId) {
    try {
      const user = await this.userModel
        .findOne({ _id: userId })
        .populate('Isub', 'name surename avatar _id');
      return user.Isub;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async getOtherSubscripers(userId) {
    try {
      const user = await this.userModel
        .findOne({ _id: userId })
        .populate('otherSub', 'name surename avatar _id');
      return user.otherSub;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async forgetpassword(email) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return {
          message: 'user dont fount',
        };
      }
      let code = randomnumbers(100000);
      user.forreset = String(code);
      await user.save();
      transporter.sendMail({
        to: user.email,
        from: 'intagramm',
        subject: 'password confirm',
        html: `
        <p> you requested for password reset</p>
        <h1>click on this <a href="http://localhost:3000/password/${user._id}/${code}">link</a>  for password reset</h1>
      `,
      });
      return {
        message: 'we sent link for reset on yor email',
      };
    } catch (error) {
      console.log(error.message);
      return {
        message: error.message,
      };
    }
  }
  async resetpassword(dto: resetpassword) {
    try {
      const user = await this.userModel.findOne({ _id: dto.userId });
      if (!user) {
        return {
          message: 'user dont found',
        };
      }
      if (String(user.forreset) !== String(dto.forreset)) {
        return {
          message: 'reset code is incorrect',
        };
      }
      user.forreset = '';
      user.password = await bcrypt.hash(dto.password, 12);
      await user.save();
      return {
        message: 'password succesfuly changet',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  async userbyId(userId) {
    try {
      const user = await this.userModel
        .findOne({ _id: userId })
        .populate('posts', 'imageUrl likes coments _id createdAt')
        .populate('saved', 'imageUrl likes coments _id');
      return user;
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async subscripersposts(userId: string) {
    try {
      const me = await this.userModel.findOne({ _id: userId });
      let posts = [];

      for (let i = 0; i < me.Isub.length; i++) {
        const el = me.Isub[i];
        const user = await this.userModel.findOne({ _id: el });
        const userposts = await this.postModel
          .find({ user: user._id })
          .populate('user', ' name surename avatar _id');
        posts = [...posts, ...userposts];
      }
      const myposts = await this.postModel
        .find({ user: me._id })
        .populate('user', ' name surename avatar _id');
      posts = [...posts, ...myposts];
      return posts;
    } catch (error) {
      console.log(error.message);
    }
  }
  async savepost(postId, userId): Promise<boolean> {
    try {
      const post = await this.postModel.findOne({ _id: postId });
      if (!post) {
        throw new HttpException('post dont fount', HttpStatus.BAD_REQUEST);
      }
      const me = await this.userModel.findOne({ _id: userId });
      if (me.saved.some((el) => String(el) === String(post._id))) {
        me.saved = me.saved.filter((el) => String(el) !== String(post._id));
      } else {
        me.saved.push(post._id);
      }
      console.log(me);
      await me.save();
      return true;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async changepassword(dto:changepassword,userId):Promise<{message:string}>{
    try {
      const user = await this.userModel
    .findOne({_id:userId })
    const validpassword = await bcrypt.compare(dto.old, user.password);
          if(validpassword){
            const newpassword=  await bcrypt.hash(dto.new, 12);
            user.password=newpassword
            await user.save()
            return {message:"password changed successfuly"}
          }
          return {message:"old password is incorrect"}
    } catch (error) {
      return {message:error.message}
    }
  }
}
