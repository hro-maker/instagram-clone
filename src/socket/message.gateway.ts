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
    const newmessage= await this.socketservise.createmessage(data)
   this.server.to(data.romId).emit('@server:Sent_message',newmessage)
  }
  
}