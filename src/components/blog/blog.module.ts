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
import { SocketGateway } from '../socket/socket.gateway';
import { SocketService } from '../socket/socket.service';
import { NotificationService } from '../notification/notification.service';
import { Notification, NotificationSchema } from 'src/models/notification.model';
import { NotificationRepository } from 'src/repositories/notification.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Notification.name, schema: NotificationSchema },
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
    AuthRepository,
    SocketGateway,
    SocketService,
    NotificationService,
    NotificationRepository],
  exports: [BlogService, BlogRepository],
})
export class BlogModule { }
