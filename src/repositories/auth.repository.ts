import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { User } from "src/models/user.model";
import { BaseRepository } from "./base.repository";
import { RegisterDto } from "src/dtos/register.dto";
import { LoginDto } from "src/dtos/login.dto";

@Injectable()
export class AuthRepository extends BaseRepository<User> {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) {
        super(userModel)
    }

    async register(data: RegisterDto, hashPassword: string, avatar?: string): Promise<User> {
        return await this.create({ ...data, avatar, password: hashPassword })
    }

}