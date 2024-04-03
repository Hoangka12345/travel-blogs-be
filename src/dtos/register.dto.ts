import { IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator"

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    readonly fullName: string

    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: Date

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @IsString()
    @Length(6, 20, { message: 'password phải chứa nhiều hơn 6 ký tự và ít hơn 20 ký tự!' })
    readonly password: string
}