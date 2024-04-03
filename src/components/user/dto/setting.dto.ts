import { IsDateString, IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator"

export class SettingDto {
    @IsString()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters long' })
    readonly oldPassword: string

    @IsString()
    @Length(6, 20, { message: 'Password must be between 6 and 20 characters long' })
    readonly newPassword: string
}