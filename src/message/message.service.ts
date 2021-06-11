import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "src/models/message";
import { Room } from "src/models/room";
import { User, UserDocument } from "src/models/user";


@Injectable()
export class Messagemodal{
    constructor( 
         @InjectModel(User.name) private userModel: Model<UserDocument>,
         @InjectModel(Message.name) private Messagemodal: Model<UserDocument>,
         @InjectModel(Room.name) private RoomModel: Model<UserDocument>,
         ){}
}