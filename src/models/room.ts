import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from "./user";
import { Post } from "./post";

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
    
}
export const  RoomSchema = SchemaFactory.createForClass(Room);