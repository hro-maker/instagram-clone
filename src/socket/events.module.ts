import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/models/message';
import { Room, RoomSchema } from 'src/models/room';
import { User, UserSchema } from 'src/models/user';
import { EventsGateway } from './message.gateway';
import { SocketServise } from './event.servise';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema }
    ]),
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema }
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [EventsGateway,SocketServise],
})
export class EventsModule {}