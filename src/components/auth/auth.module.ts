import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.model';
import { AuthRepository } from 'src/repositories/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),

  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, CloudinaryService],
  exports: [AuthService, AuthRepository]
})
export class AuthModule { }
