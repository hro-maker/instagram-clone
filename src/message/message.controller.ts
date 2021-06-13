import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { getmessages, Messageservise } from './message.service';
import { AuthGuard } from './../utiles/guards/canactivate';

@Controller('message')
export class MessageController {
        constructor(private messageservise:Messageservise){}
    @Get('/getbyromid/:userid')
    @UseGuards(AuthGuard)
    getmessagesbyuserId(@Param()param,@Req()req):Promise<getmessages>{
            return this.messageservise.getmessage(param.userid,req.userId)
    }
    @Get('/getrooms')
    @UseGuards(AuthGuard)
    getrooms(@Req()req){
            return this.messageservise.getallchatrooms(req.userId)
    }
    @Get('/removeall')
    remooveall(){
        return this.messageservise.remooveall()
    }
}
