import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileServise } from 'src/file/file.servise';
import { User, UserSchema } from 'src/models/user';
import { AuthController } from './auth.controller';
import { Authprovider } from './auth.servise';

@Module({
  imports:[MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers:[Authprovider,FileServise]
})
export class AuthModule {}
