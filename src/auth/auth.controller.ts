import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Authprovider } from './auth.servise';
import { logindto, registerdto, resetpassword } from './../dtos/authdto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/utiles/guards/canactivate';

@Controller('auth')
export class AuthController {
  constructor(private authservise: Authprovider) {}
  @Post('/register')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'foto', maxCount: 1 }]))
  register(@Body() dto: registerdto, @UploadedFiles() files) {
    return this.authservise.register(dto, files.foto);
  }
  @Post('/login')
  login(@Body() dto: logindto,@Res()res) {
    return this.authservise.login(dto,res);
  }
  @Patch('/update')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'foto', maxCount: 1 }]))
  updateprofile(@Body() dto: any, @Req() req: any, @UploadedFiles() files) {
    return this.authservise.updateprofile(dto, files, req.userId);
  }
  @Patch('/confirm')
  confirm(@Body(){code,email}) {
    return this.authservise.emailconfirm(email,code);
  }

  @Patch('/subscr')
  @UseGuards(AuthGuard)
  subscrip(@Body()dto,@Req()req){
      return this.authservise.subscript(req.userId,dto.userId)
  }

  @Patch('/unsubscr')
  @UseGuards(AuthGuard)
  unsubscrip(@Body()dto,@Req()req){
      return this.authservise.unSubscript(req.userId,dto.userId)
  }

  @Get()
  @UseGuards(AuthGuard)
  me(@Req()req){
      return this.authservise.me(req.userId)
  }

  @Get('/isub/:id')
  @UseGuards(AuthGuard)
  isub(@Param() {id}){
      return this.authservise.getISubscripers(id)
  }

  @Get('/othersub/:id')
  @UseGuards(AuthGuard)
  othersub(@Param() {id}){
      return this.authservise.getOtherSubscripers(id)
  }
  @Get('/user/:id')
  @UseGuards(AuthGuard)
  userbyid(@Param() {id}){
      return this.authservise.userbyId(id)
  }

  @Patch('/forgot')
  forgot(@Body()dto){
      return this.authservise.forgetpassword(dto.email)
  }

  @Patch('/reset')
  reset(@Body()dto:resetpassword){
      return this.authservise.resetpassword(dto)
  }

  @Get('/sub/posts')
  @UseGuards(AuthGuard)
  subposts(@Req()req){
      return this.authservise.subscripersposts(req.userId)
  }

}
