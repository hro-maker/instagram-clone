import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from "./user";
import { Post } from "./post";
import { Message } from "./message";

export type  RoomDocument= Room & Document;

@Schema()
export class Room{
    
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],default:[] })
    romusers: User[];

    @Prop({ type: String })
    users:string;

    @Prop({ type:Date,default:Date.now()})
    createdAt: Date;

    @Prop({ type:Date,default:Date.now()})
    updatedAt?: Date;

    @Prop({ type:Number,default:0})
    count: Number;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' ,required:false})
    last:Message

}
export const  RoomSchema = SchemaFactory.createForClass(Room);