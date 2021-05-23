import { Body, Controller, Get, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { registerdto } from 'src/dtos/authdto';
import { createpostdto } from 'src/dtos/postdto';
import { AuthGuard } from 'src/utiles/guards/canactivate';
import { postservise } from './post.servise';
import { Request } from 'express';
@Controller('post')
export class PostController {
    constructor(private postservise:postservise){}
    @Post('/create')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'foto', maxCount: 1 }
      ]))
    createpost(@Body()dto:createpostdto,@Req() req:any,@UploadedFiles() files){
        return this.postservise.create({description:dto.description,userId:req.userId},files)
    }

    @Get('/getall')
    getall(){
        return this.postservise.getall()
    }
}
