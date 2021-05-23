import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import * as jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req=context.switchToHttp().getRequest()
           const   eclude= async()=>{
               try {
                if(!req.headers.authorization ){
                    throw new UnauthorizedException("you must login")
             }
             const tokenn=req.headers.authorization.split(" ")[1]
                    const token=await jwt.verify(tokenn,process.env.JWT_SECRET)
                    req.userId=token.id
                    req.email=token.email
                    return true
               } catch (error) {
                   throw new HttpException(error.message,HttpStatus.BAD_REQUEST)
               }
            }
            return eclude()
    }
    
}