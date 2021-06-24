import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileServise } from 'src/file/file.servise';
import { Events, EventsSchema } from 'src/models/events';
import { PostSchema,Post } from 'src/models/post';
import { User, UserSchema } from 'src/models/user';
import { PostController } from './post.controller';
import { postservise } from './post.servise';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    MongooseModule.forFeature([
      { name: Events.name, schema: EventsSchema }
    ])
  ],
  controllers: [PostController],
  providers:[postservise,FileServise]
})
export class PostModule {}
