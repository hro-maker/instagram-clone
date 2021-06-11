import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message, MessageDocument } from "src/models/message";
import { Room, RoomDocument } from "src/models/room";
import { User, UserDocument } from "src/models/user";

export interface getmessages{
    messages:MessageDocument[],
    room:RoomDocument
}
@Injectable()
export class Messageservise{
    constructor( 
         @InjectModel(User.name) private userModel: Model<UserDocument>,
         @InjectModel(Message.name) private Messagemodal: Model<MessageDocument>,
         @InjectModel(Room.name) private RoomModel: Model<RoomDocument>,
         ){}
    async getmessage(Fuser,Suser):Promise<getmessages>{
       try {
        const rooms= await this.RoomModel.find().populate('romusers','_id name surename avatar')
        const firstregex = new RegExp(String(Fuser), 'g');
        const secntregex = new RegExp(String(Suser), 'g');
         const room=rooms.filter(el=>firstregex.test(el.users) && secntregex.test(el.users))[0]
             if(room){
              const  messages=await this.Messagemodal
              .find({romId:room._id})
              .populate("senter",'_id name surename avatar')
              .populate('secnt','_id name surename avatar')   
                     return {
                        messages,
                        room:room
                     }
             }else{
                    const newroom=await this.RoomModel.create({
                        romusers:[Fuser,Suser],
                        users:`${Fuser}${Suser}`,
                        createdAt:Date.now(),
                        updatedAt:Date.now()
                    })
                    return {
                        messages:[],
                        room:newroom
                    }
             }
       } catch (error) {
          throw new HttpException(error.message,HttpStatus.BAD_REQUEST)
       }
    }   
    
    
}