import { UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Server,Socket} from 'socket.io'
import { SocketServise } from './event.servise';
export interface newmessage{
  text: string,
  romId: string,
  senter: string,
  secnt: string
}
export interface statuss{
  id:string,
  status:boolean
}
export interface eventlike{
  subject:string,
  object:string,
  post:string,
  comment?:string,
  comentId?:string
}
@WebSocketGateway()
export class EventsGateway {
  constructor(private socketservise:SocketServise){}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('@Client:Join_room')
  joinroom(@ConnectedSocket() client: Socket,@MessageBody() data: string){
    if(typeof data === 'string'){
          client.join(data)
    }
  } 
  @SubscribeMessage('@Client:Sent_message')
 async onEvent(client: any, data: newmessage) {
    const {newmessage,newroom}= await this.socketservise.createmessage(data)
   this.server.to(data.romId).emit('@server:Sent_message',newmessage)
      this.server.emit('@server:new_room',newroom)
  }
  @SubscribeMessage('@Client:Sent_message_image')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'foto', maxCount: 10 }
  ]))
 async sentimage(client: any, data: newmessage,@UploadedFiles() files) {
   console.log(files,Date.now())
  //   const {newmessage,newroom}= await this.socketservise.createmessage(data)
  //  this.server.to(data.romId).emit('@server:Sent_message',newmessage)
  //  this.server.emit('@server:new_room',newroom)
  }
  
  @SubscribeMessage('@Client:user_status')
  async changestatus(client: any, data:statuss ) {
    const changeduser=await this.socketservise.changestatus(data)
    this.server.emit('@server:user_status',changeduser)
   }
   @SubscribeMessage('@Client:events_like')
  async eventlike(client: any, data:eventlike ) {
    const event=await this.socketservise.eventslike(data,'like')
     this.server.emit('@server:newevent',event)
   }
   @SubscribeMessage('@Client:event_follow')
   async eventfollow(client: any, data:eventlike ) {
     const event=await this.socketservise.eventslike(data,'follow')
     this.server.emit('@server:newevent',event)
    }
    @SubscribeMessage('@Client:event_comment')
   async eventcomment(client: any, data:eventlike ) {
     const event=await this.socketservise.eventslike(data,'comment')
     this.server.emit('@server:newevent',event)
    }
}
