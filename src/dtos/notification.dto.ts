import { ArrayMaxSize, ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator"

export class NotificationDto {
    @IsNotEmpty()
    @IsMongoId()
    blog: string

    @IsNotEmpty()
    @IsString()
    content: string
}