import { Module } from "@nestjs/common";
import { CloudinaryProvider } from "./cloudinary.provider";
import { FileServise } from "./file.servise";

@Module({
    providers: [FileServise,CloudinaryProvider],
    exports:[CloudinaryProvider,FileServise]
})
export class filemodule { }