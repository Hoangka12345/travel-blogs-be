import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentRepository } from 'src/repositories/comment.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/models/comment.model';
import { Blog, BlogSchema } from 'src/models/blog.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  providers: [CommentService, CommentRepository],
  exports: [CommentService, CommentRepository]
})
export class CommentModule { }
