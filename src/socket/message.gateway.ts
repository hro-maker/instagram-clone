import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Server} from 'socket.io'
import { SocketServise } from './event.servise';
interface newmessage{
  text: string,
  roomId: string,
  senter: string,
  secnt: string
}
@WebSocketGateway()
export class EventsGateway {
  constructor(private socketservise:SocketServise){}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('@Client:Sent_message')
  onEvent(client: any, data: newmessage) {
   this.server.to(data.roomId).emit('@server:Sent_message')
  }

}