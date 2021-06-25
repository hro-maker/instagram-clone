import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coment, ComentSchema } from 'src/models/comentschema';
import { Events, EventsSchema } from 'src/models/events';
import { Post, PostSchema } from 'src/models/post';
import { User, UserSchema } from 'src/models/user';
import { ComentController } from './coment.controller';
import { Commentservise } from './comment.servise';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
    ]),
    MongooseModule.forFeature([
      { name: Coment.name, schema: ComentSchema },
    ]),
    MongooseModule.forFeature([
      { name: Events.name, schema: EventsSchema }
    ])
  ],
  controllers: [ComentController],
  providers:[Commentservise]
})
export class ComentModule {}
