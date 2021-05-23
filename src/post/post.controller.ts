import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { registerdto } from 'src/dtos/authdto';
import { postservise } from './post.servise';

@Controller('post')
export class PostController {
    constructor(private postservise:postservise){}
    @Post('/create')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'foto', maxCount: 1 }
      ]))
    register(@Body()dto:registerdto,@UploadedFiles() files){
       
    }
}
