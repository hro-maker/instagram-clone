import { WebSocketGateway, WebSocketServer, SubscribeMessage, WsResponse } from "@nestjs/websockets"

@WebSocketGateway(7002)
export class SampleWsGateway {
    @WebSocketServer() server

    @SubscribeMessage("events")
    onEvent(client, data: any): WsResponse<any> {
        console.log("received message on [events], data = ", data)
        return data
    }

    handleConnection(client) {
        console.log("connection to socket... token = ")
    }
}