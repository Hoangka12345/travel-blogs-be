import { IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator"

export class LoginDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters long' })
    readonly password: string
}