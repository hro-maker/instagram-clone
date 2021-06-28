import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Events, EventsSchema } from 'src/models/events';
import { Message, MessageSchema } from 'src/models/message';
import { Room, RoomSchema } from 'src/models/room';
import { User, UserSchema } from 'src/models/user';
import { MessageController } from './message.controller';
import { Messageservise } from './message.service';

import { FileServise } from 'src/file/file.servise';
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
    ]),
    MongooseModule.forFeature([
      { name: Events.name, schema: EventsSchema }
    ])
  ],
  controllers: [MessageController],
  providers:[Messageservise,FileServise]
})
export class MessageModule {}
