import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv'
dotenv.config()
@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.3l6j1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    ),
    AuthModule,
  ],
})
export class AppModule {}
