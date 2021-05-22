import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { Authprovider } from './auth.servise';
import { registerdto } from './../dtos/authdto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller('auth')
export class AuthController {
    constructor(private authservise:Authprovider){}
    @Post('/register')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'foto', maxCount: 1 }
      ]))
    register(@Body()dto:registerdto,@UploadedFiles() files){
        return this.authservise.register(dto,files.foto)
    }

      
}
