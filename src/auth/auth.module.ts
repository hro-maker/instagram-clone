import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileServise } from 'src/file/file.servise';
import { Events, EventsSchema } from 'src/models/events';
import { Post, PostSchema } from 'src/models/post';
import { User, UserSchema } from 'src/models/user';
import { AuthController } from './auth.controller';
import { Authprovider } from './auth.servise';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema }
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    MongooseModule.forFeature([
      { name: Events.name, schema: EventsSchema }
    ])
  ],
  controllers: [AuthController],
  providers: [Authprovider, FileServise],
})
export class AuthModule {}
