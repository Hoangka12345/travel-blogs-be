import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { BlogRepository } from 'src/repositories/blog.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/models/blog.model';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CommentService } from '../comment/comment.service';
import { CommentRepository } from 'src/repositories/comment.repository';
import { Comment, CommentSchema } from 'src/models/comment.model';
import { UserService } from '../user/user.service';
import { UserRepository } from 'src/repositories/user.repository';
import { User, UserSchema } from 'src/models/user.model';
import { AuthService } from '../auth/auth.service';
import { AuthRepository } from 'src/repositories/auth.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BlogController],
  providers: [
    BlogService,
    BlogRepository,
    CloudinaryService,
    CommentService,
    CommentRepository,
    UserService,
    UserRepository,
    AuthService,
    AuthRepository],
  exports: [BlogService, BlogRepository, MongooseModule],
})
export class BlogModule { }