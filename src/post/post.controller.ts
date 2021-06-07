import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { createpostdto, updatepostdto } from 'src/dtos/postdto';
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

    @Patch('/update')
    @UseGuards(AuthGuard)
    update(@Body()dto:updatepostdto,@Req() req){
                return this.postservise.updatedescription(dto,req.userId)
    }

    @Post('/toglelike')
    @UseGuards(AuthGuard)
    togglepostlike(@Body()dto,@Req() req:any){
        return this.postservise.togglepostlike(dto.postId,req.userId)
    }
    @Get('/likes/:id')
    getlikesbypostid(@Param("id")id:any){
            return this.postservise.getlikesbypostId(id)
    }
    @Get('/remove')
    removeall(){
            return this.postservise.removeall()
    }
    @Get('/removebyid/:id')
    remove(@Param("id")id:any){
            return this.postservise.deletepost(id)
    }
}
