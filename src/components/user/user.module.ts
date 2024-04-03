import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthService } from '../auth/auth.service';
import { AuthRepository } from 'src/repositories/auth.repository';
import { BlogService } from '../blog/blog.service';
import { BlogRepository } from 'src/repositories/blog.repository';
import { Blog, BlogSchema } from 'src/models/blog.model';
import { Comment, CommentSchema } from 'src/models/comment.model';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
    ]), BlogModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    CloudinaryService,
    AuthService,
    AuthRepository,
    BlogRepository
  ],
  exports: [UserService, UserRepository]
})
export class UserModule { }
