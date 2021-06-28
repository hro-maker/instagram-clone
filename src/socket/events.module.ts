import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/models/message';
import { Room, RoomSchema } from 'src/models/room';
import { User, UserSchema } from 'src/models/user';
import { EventsGateway } from './message.gateway';
import { SocketServise } from './event.servise';
import { Events, EventsSchema } from 'src/models/events';
import { filemodule } from 'src/file/file.module';

@Module({
  imports: [
    filemodule,
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema }
    ]),
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema }
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    MongooseModule.forFeature([
      { name: Events.name, schema: EventsSchema }
    ])
  ],
  providers: [EventsGateway,SocketServise],
})
export class EventsModule {}