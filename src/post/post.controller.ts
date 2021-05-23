import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { createpostdto } from 'src/dtos/postdto';
import { AuthGuard } from 'src/utiles/guards/canactivate';
import { postservise } from './post.servise';
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
    @UseGuards(AuthGuard)
    getall(){
        return this.postservise.getall()
    }

    @Get('/getbyId/:id')
    @UseGuards(AuthGuard)
    getbyId(@Param("id")id:any){
        return this.postservise.getbyId(id)
    }
}
