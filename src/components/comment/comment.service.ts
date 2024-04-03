import { Injectable } from '@nestjs/common';
import { CommentDto } from 'src/dtos/comment.dto';
import { CommentRepository } from 'src/repositories/comment.repository';
import { RemoveCommentDto } from '../../dtos/remove-comment.dto';
import { Comment } from 'src/models/comment.model';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepo: CommentRepository,
    ) { }

    async createComment(blogId: string, content: string, userId: string): Promise<Comment> {
        try {
            const newComment = await this.commentRepo.create({ blog: blogId, content, user: userId })
            if (newComment) {
                return newComment
            } return null
        } catch (error) {
            console.log(">>> comment service: create comment ", error);
            return null
        }
    }

    async checkCommentInfo(userId: string, data: RemoveCommentDto): Promise<boolean> {
        const { commentId, blogId } = data
        try {
            const comment = await this.commentRepo.findOneByCondition({ _id: commentId, user: userId, blog: blogId })
            if (comment) {
                return true
            } return false
        } catch (error) {
            console.log(">>> comment service: remove comment ", error);
            return false
        }
    }
}
