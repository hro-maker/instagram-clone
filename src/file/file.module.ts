
import { Module } from "@nestjs/common";
import { FileServise } from "./file.servise";

@Module({
    providers: [FileServise]
})
export class filemodule { }