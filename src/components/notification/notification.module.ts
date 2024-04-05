import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from 'src/repositories/notification.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from 'src/models/notification.model';
import { BlogRepository } from 'src/repositories/blog.repository';
import { Blog, BlogSchema } from 'src/models/blog.model';
import { SocketGateway } from '../socket/socket.gateway';
import { SocketService } from '../socket/socket.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Blog.name, schema: BlogSchema },
    ])
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, BlogRepository, SocketGateway, SocketService],
  exports: [NotificationService, NotificationRepository]
})
export class NotificationModule { }
