import { Body, Controller, Get, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { getmessages, Messageservise } from './message.service';
import { AuthGuard } from './../utiles/guards/canactivate';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('message')
export class MessageController {
  constructor(private messageservise: Messageservise) {}
  @Get('/getbyromid/:userid')
  @UseGuards(AuthGuard)
  getmessagesbyuserId(@Param() param, @Req() req): Promise<getmessages> {
    return this.messageservise.getmessage(param.userid, req.userId);
  }
  @Get('/getrooms')
  @UseGuards(AuthGuard)
  getrooms(@Req() req) {
    return this.messageservise.getallchatrooms(req.userId);
  }
  @Get('/getevents')
  @UseGuards(AuthGuard)
  getevents(@Req() req) {
    return this.messageservise.getallevents(req.userId);
  }
  @Get('/readevents')
  @UseGuards(AuthGuard)
  readevents(@Req() req) {
    return this.messageservise.readallevents(req.userId);
  }
  @Get('/removeall')
  remooveall() {
    return this.messageservise.remooveall();
  }
  @Post('/images/save')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
      { name: 'foto', maxCount: 10 }
    ]))
  createpost(@Body()dto:any,@Req() req:any,@UploadedFiles() files){
          return this.messageservise.createimages(files.foto)
  }
}
