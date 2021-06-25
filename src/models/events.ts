import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Post } from "./post";
import * as mongoose from 'mongoose';
import { User } from "./user";
import { Coment } from "./comentschema";
export type  EventsDocument= Events & Document;

@Schema()
export class Events{

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post',required:false })
    post:Post
    
    @Prop({ type: String,enum:['like','follow','comment'] })
    type:String

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coment',required:false })
    comentId:Coment
    
    @Prop({ type: String,required:false,default:"" })
    comment:String

    @Prop({ type: Boolean, default:false })
    readed:Boolean

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    subject:User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    object:User

    @Prop({ type:Date,default:Date.now()})
    createdAt: Date;    
}
export const  EventsSchema = SchemaFactory.createForClass(Events);