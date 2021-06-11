import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { getmessages, Messageservise } from './message.service';
import { AuthGuard } from './../utiles/guards/canactivate';

@Controller('message')
export class MessageController {
        constructor(private messageservise:Messageservise){}
    @Get('/getbyromid/:userid')
    @UseGuards(AuthGuard)
    getmessagesbyuserId(@Param()param,@Req()req){
            return this.messageservise.getmessage(param.userid,req.userId)
    }
}
