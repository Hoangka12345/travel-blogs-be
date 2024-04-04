import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './components/auth/auth.module';
import { CloudinaryService } from './components/cloudinary/cloudinary.service';
import { CloudinaryModule } from './components/cloudinary/cloudinary.module';
import { BlogModule } from './components/blog/blog.module';
import { CommentModule } from './components/comment/comment.module';
import { UserModule } from './components/user/user.module';
import { NotificationModule } from './components/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DB_CONNECTION_STRING
      })
    }),
    AuthModule,
    CloudinaryModule,
    BlogModule,
    CommentModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService, CloudinaryService],
})
export class AppModule { }
