import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { createcomentdto } from './../dtos/commentdtos';
import { Commentservise } from './comment.servise';
import { AuthGuard } from './../utiles/guards/canactivate';

@Controller('coment')
export class ComentController {
    constructor(private comentservise:Commentservise){}
    @Post('/create')
    @UseGuards(AuthGuard)
    createpost(@Body()dto:createcomentdto,@Req()req){
            return this.comentservise.createcomment(dto,req.userId)
    }

    @Post("/delete")
    @UseGuards(AuthGuard)
    deletepost(@Body()dto,@Req()req){
           return this.comentservise.deletecoment(dto.comentId,dto.postId,req.userId)
    }
    @Get('/getcoments/:postid')
    getcomentsbypostid(@Param() {postid}){
       return this.comentservise.comentsbypostid(postid)      
    }
}
