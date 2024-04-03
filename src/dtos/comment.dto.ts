import { IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, Length, isDateString } from "class-validator"

export class CommentDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly blogId: string

    @IsNotEmpty()
    @IsString()
    readonly content: string

}