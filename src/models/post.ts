import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from "./user";
import { Coment } from "./comentschema";

export type PostDocument=Post & Document;

@Schema()
export class Post{
    @Prop({type:String,default:""})
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user:User

    @Prop({type:String,required:true})
    imageUrl: string;

    @Prop({type:[String],default:[]})
    likes: string[];


    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coment' }],default:[] })
    coments: Coment[];

    @Prop({ type:Date,default:Date.now()})
    createdAt: Date;

    @Prop({ type:Date,default:Date.now()})
    updatedAt: Date;

}
export const PostSchema = SchemaFactory.createForClass(Post);