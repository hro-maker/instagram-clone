import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from "./user";
import { Room } from "./room";

export type  MessageDocument= Message & Document;

@Schema()
export class Message{
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
    romId:Room
    
    @Prop({ type:String})
    text: String; 

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],default:[] })
    likes: User[];

    @Prop({ type: String,enum:['message','audio','image'],default:"message" })
    type:String
    
    
    @Prop({ type: [String],default:[] })
    images:String[]
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    senter:User
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    secnt:User
    
    @Prop({ type:Boolean,default:false})
    readed: Boolean;
    @Prop({ type:Date,default:Date.now()})
    createdAt: Date;    
}
export const  MessageSchema = SchemaFactory.createForClass(Message);