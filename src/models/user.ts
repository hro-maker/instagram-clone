import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongoSchema } from 'mongoose';
import { Post } from './post';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  surename: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Boolean, default: false })
  isActive: boolean;

  @Prop({ type: String, required: false, default: '' })
  avatar?: string;

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}]})
  posts: Post[];
  
  @Prop({ type: [String], required: false, default: [] })
  images?: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
