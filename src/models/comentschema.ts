import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from "./user";
import { Post } from "./post";
import { Events } from 'src/models/events';

export type ComentDocument=Coment & Document;

@Schema()
export class Coment{

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId:User

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    postId:Post

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],default:[] })
    likes: User[];

    @Prop({ type: String ,required:true})
    text:string

    @Prop({ type: String ,default:""})
    parentId:string

    @Prop({ type:Date,default:Date.now()})
    createdAt: Date;

    @Prop({ type:Date,default:Date.now()})
    updatedAt?: Date;
}
export const ComentSchema = SchemaFactory.createForClass(Coment);