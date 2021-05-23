import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from "./user";
import { Post } from "./post";

export type ComentDocument=Coment & Document;

@Schema()
export class Coment{

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user:User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post:Post
    
    @Prop({type:[String],default:[]})
    likes: string[];

    @Prop({ type:Date,default:Date.now()})
    createdAt: Date;

    @Prop({ type:Date,default:Date.now()})
    updatedAt?: Date;

    
}
export const ComentSchema = SchemaFactory.createForClass(Coment);