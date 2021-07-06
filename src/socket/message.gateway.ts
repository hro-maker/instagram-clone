import { UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  secnt: string,
  post:any
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
let usersinside={}
@WebSocketGateway()
export class EventsGateway {
  constructor(private socketservise:SocketServise){}
  @WebSocketServer()
  server: Server;
  //room

    usersinside={}
  @SubscribeMessage('@Client:Join_room')
  joinroom(@ConnectedSocket() client: Socket,@MessageBody() data: any){
    if(data){
      if(typeof data === 'string'){
        console.log('join',data)
          client.join(data)
    }else{
      client.join(data.roomId)
      console.log('onjoin',data)
      this.usersinside[data.roomId]=this.usersinside[data] ? [...this.usersinside[data],data.user] : [data.user]
      this.server.to(data.roomId).emit('@Server:users_inside',this.usersinside)
    }
    }
  } 


  @SubscribeMessage('@Client:leave_room')
  leaveroom(@ConnectedSocket() client: Socket,@MessageBody() data: any){
    if(data){
      if(typeof data === 'string'){
        client.leave(data)
        console.log("leave",data)
  }else{
      client.leave(data.roomId)
      console.log('onleave',data)
      this.usersinside[data.roomId]=this.usersinside[data]?.filter(el=>String(el._id) === String(data.user._id))
      this.server.to(data.roomId).emit('@Server:user_leave_room',this.usersinside)
      console.log('leave',this.usersinside)
  }
    }
  } 
  //message
  @SubscribeMessage('@Client:Sent_message')
 async onEvent(client: any, data: newmessage) {
    const {newmessage,newroom}= await this.socketservise.createmessage(data)
   this.server.to(data.romId).emit('@server:Sent_message',newmessage)
      this.server.emit('@server:new_room',{newmessage,newroom})
  }
  @SubscribeMessage('@Client:Sent_message_images')
  async sentimage(client: any, data: newmessage) {
      const {newmessage,newroom}= await this.socketservise.createmessage(data,"image")
     this.server.to(data.romId).emit('@server:Sent_message',newmessage)
     this.server.emit('@server:new_room',{newmessage,newroom})
   }
   @SubscribeMessage('@Client:Sent_message_voice')
   async setvoice(client: any, data: newmessage) {
       const {newmessage,newroom}= await this.socketservise.createmessage(data,"audio")
      this.server.to(data.romId).emit('@server:Sent_message',newmessage)
      this.server.emit('@server:new_room',{newmessage,newroom})
    }
    @SubscribeMessage('@Client:Sent_message_post')
    async sentpost(client: any, data: newmessage) {
        const {newmessage,newroom}= await this.socketservise.createmessage(data,"post")
       this.server.to(data.romId).emit('@server:Sent_message',newmessage)
       this.server.emit('@server:new_room',{newmessage,newroom})
     }
    // user status
  @SubscribeMessage('@Client:user_status')
  async changestatus(client: any, data:statuss ) {
    const changeduser=await this.socketservise.changestatus(data)
    this.server.emit('@server:user_status',changeduser)
   }
   //event
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
    @SubscribeMessage('changetype')
    async changeevent(client: any, data:any ) {
      const {id,message,room}=data
      this.server.to(room).emit('@server:changetype',{id,message,room})
     }
     @SubscribeMessage('Client:calling_to_user')
    async callingtouser(client: any, data:any ) {
      const {caller,targetid}=data
      this.server.emit('@server:calling_to_user',{caller,targetid})
     }
     @SubscribeMessage('@client:calling_answer')
     async callinganswer(client: any, data:any ) {
       this.server.emit('@server:calling_answer',data)
      }
}
