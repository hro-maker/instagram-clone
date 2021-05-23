import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Authprovider } from './auth.servise';
import { logindto, registerdto } from './../dtos/authdto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from 'src/models/user';
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
  login(@Body() dto: logindto) {
    return this.authservise.login(dto);
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
}
