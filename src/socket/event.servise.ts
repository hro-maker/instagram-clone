import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/models/message';
import { Room, RoomDocument } from 'src/models/room';
import { User, UserDocument } from 'src/models/user';
import { newmessage, statuss } from './message.gateway';

@Injectable()
export class SocketServise {
    constructor( 
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Message.name) private Messagemodal: Model<MessageDocument>,
        @InjectModel(Room.name) private RoomModel: Model<RoomDocument>,
        ){}
        async createmessage(data:newmessage){
         const message=await this.Messagemodal.create({...data,createdAt:new Date(Date.now())})
         const newmessage= await this.Messagemodal.findOne({_id:message._id})
         .populate("senter",'_id name surename avatar')
         .populate('secnt','_id name surename avatar') 
         const room=await this.RoomModel.findOneAndUpdate({_id:data.romId},{updatedAt:new Date(Date.now())})

         return newmessage
      }
      async changestatus(data:statuss){
        const user=await this.userModel.findOneAndUpdate({_id:data.id},{isActive:data.status})
        return user
      }
}
