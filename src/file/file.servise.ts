import { Injectable } from "@nestjs/common";
import { HttpException, HttpStatus, Module } from "@nestjs/common";
import * as path from "path"
import * as fs from "fs"
import  * as uuid from "uuid"
@Injectable()
export class FileServise{
    create(file):string{
        try {
            const fileExeption= file.originalname.split('.').pop()
            const fileName= uuid.v4() +'.'+ fileExeption
            const filePath= path.resolve(__dirname,'..','static','image')
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath,{recursive:true})
            }
            fs.writeFileSync(path.resolve(filePath,fileName ),file.buffer)
            return 'image'+"/"+fileName
        } catch (error) {
                throw new HttpException(error.message,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}