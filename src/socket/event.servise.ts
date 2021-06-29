import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Events, EventsDocument } from 'src/models/events';
import { Message, MessageDocument } from 'src/models/message';
import { Room, RoomDocument } from 'src/models/room';
import { User, UserDocument } from 'src/models/user';
import { eventlike, newmessage, statuss } from './message.gateway';
import { FileServise } from 'src/file/file.servise';

@Injectable()
export class SocketServise {
    constructor( 
      private fileservise:FileServise,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Message.name) private Messagemodal: Model<MessageDocument>,
        @InjectModel(Room.name) private RoomModel: Model<RoomDocument>,
        @InjectModel(Events.name) private eventsmodel: Model<EventsDocument>,
        ){}
        async createmessage(data:newmessage,type='message'){
         const message=await this.Messagemodal.create({...data,type,createdAt:new Date(Date.now())})
         const newmessage:any= await this.Messagemodal.findOne({_id:message._id})
         .populate("senter",'_id name surename avatar lastvisite')
         .populate('secnt','_id name surename avatar lastvisite') 
         const room=await this.RoomModel.findOne({_id:data.romId}).populate('romusers','_id name surename avatar isActive')
         room.updatedAt=new Date(Date.now())
         room.save()
         return {newmessage,newroom:{room,userid:newmessage.secnt._id}}
      }
      async changestatus(data:statuss){
        let user=await this.userModel.findOneAndUpdate({_id:data.id},{isActive:data.status,lastvisite:new Date(Date.now())})
        user=await this.userModel.findOne({_id:data.id})
        return user
      }
      async eventslike(data:any,type){
          const newevent:any={
            subject:data.subject,
            object:data.object,
            type
          }
          if(data.post){
            newevent.post=data.post
          }
          if(data.comment){
            newevent.comment=data.comment
            newevent.comentId=data.comentId
          }
          let event=await  this.eventsmodel.create(newevent)
          event=await this.eventsmodel.findOne({_id:event._id})
          .populate('post','_id imageUrl')
          .populate('subject','_id name avatar')
          return event
      
      }
}
