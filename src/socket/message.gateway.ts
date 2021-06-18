import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Server} from 'socket.io'
import { SocketServise } from './socket';

@WebSocketGateway()
export class EventsGateway {
  constructor(private socketservise:SocketServise){}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    console.log("hellllllllsssssssssssssssssssssssssllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll")
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('message')
 async ev(client: any, data: any){
      const answer=await this.socketservise.sayhello()
    console.log(answer)
   
  }
}