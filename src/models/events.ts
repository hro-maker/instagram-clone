import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Post } from "./post";
import * as mongoose from 'mongoose';
import { User } from "./user";
export type  EventsDocument= Events & Document;

@Schema()
export class Events{

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post',required:false })
    post:Post
    
    @Prop({ type: String, ref: 'Post',enum:['like','follow'] })
    type:String

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    subject:User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    object:User

    @Prop({ type:Date,default:Date.now()})
    createdAt: Date;    
}
export const  EventsSchema = SchemaFactory.createForClass(Events);