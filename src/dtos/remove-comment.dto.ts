import { IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, Length, isDateString } from "class-validator"

export class RemoveCommentDto {
    @IsNotEmpty()
    @IsMongoId()
    readonly blogId: string

    @IsNotEmpty()
    @IsString()
    readonly commentId: string

}