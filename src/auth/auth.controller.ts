import { Body, Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { Authprovider } from './auth.servise';
import { registerdto } from './../dtos/authdto';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";

@Controller('auth')
export class AuthController {
    constructor(private authservise:Authprovider){}
    @Post('/register')
    @UseInterceptors(FileInterceptor('files'))
    createproduct(@UploadedFile() files: Express.Multer.File){
            console.log(files)
            
    }
}
