import { ArrayMaxSize, ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator"

export class BlogDto {
    @IsNotEmpty()
    @IsString()
    address: string

    @IsString()
    country: string

    @IsString()
    city: string

    @IsNotEmpty()
    @IsString()
    content: string
}