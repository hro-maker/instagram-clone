import { Module, Post } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coment, ComentSchema } from 'src/models/comentschema';
import { PostSchema } from 'src/models/post';
import { User, UserSchema } from 'src/models/user';
import { PostController } from './post.controller';
import { postservise } from './post.servise';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Coment.name, schema: ComentSchema },
    ]),
  ],
  controllers: [PostController],
  providers:[postservise]
})
export class PostModule {}
