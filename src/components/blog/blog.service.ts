import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BlogDto } from 'src/dtos/blog.dto';
import { CommentDto } from 'src/dtos/comment.dto';
import { I_Response } from 'src/interfaces/response-data.interface';
import { Blog } from 'src/models/blog.model';
import { BlogRepository } from 'src/repositories/blog.repository';
import { CommentService } from '../comment/comment.service';
import { RemoveCommentDto } from 'src/dtos/remove-comment.dto';
import { UserService } from '../user/user.service';
import mongoose from 'mongoose';

@Injectable()
export class BlogService {
    constructor(
        private readonly blogRepo: BlogRepository,
        private readonly commentService: CommentService,
        private readonly userService: UserService
    ) { }

    convertLetter(string: string) {
        return string
            .replace(/a/g, '[a,á,à,ã,ả,ạ,ă,ắ,ặ,ằ,ẳ,ẵ,â,ấ,ầ,ẩ,ẫ,ậ]')
            .replace(/e/g, '[e,é,è,ẻ,ẽ,ẹ,ê,ế,ề,ể,ễ,ệ]')
            .replace(/i/g, '[i,í,ì,ỉ,ĩ,ị]')
            .replace(/o/g, '[o,ó,ò,ỏ,õ,ọ,ô,ố,ồ,ổ,ỗ,ộ,ơ,ớ,ờ,ở,ỡ,ợ]')
            .replace(/u/g, '[u,ú,ù,ủ,ũ,ụ,ư,ứ,ừ,ử,ữ,ự]')
            .replace(/y/g, '[y,ý,ỳ,ỷ,ỹ,ỵ]')
            .replace(/d/g, '[d,đ]');
    }

    async getBlogs(page: number, search: string = ""): Promise<I_Response<Blog>> {
        const regex = this.convertLetter(search)

        try {
            const blogs = await this.blogRepo.findAllByCondition(
                { address: { $regex: regex, $options: 'i' } },
                (page - 1) * 5, 5, "user", ["_id", "fullName", "avatar"]
            )
            if (blogs[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: blogs
                }
            } return {
                statusCode: HttpStatus.OK,
                data: []
            }
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getBlogsWhenLogin(userId: string, page: number, search: string = ""): Promise<I_Response<Blog>> {
        const regex = this.convertLetter(search)
        try {
            const blogs = await this.blogRepo.getBlogsWhenLogin(regex, userId, page)

            if (blogs[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: blogs
                }
            } return {
                statusCode: HttpStatus.OK,
                data: []
            }
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new InternalServerErrorException
        }
    }

    async getBlogDetail(blogId: string, userId: string): Promise<I_Response<Blog>> {
        try {
            const blog = await this.blogRepo.getBlogDetail(blogId, userId)
            if (blog[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: blog[0]
                }
            } throw new ConflictException
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new ConflictException
        }
    }

    async getCommentsAndReactions(blogId: string): Promise<I_Response<Blog>> {
        try {
            const blogs = await this.blogRepo.getCommentsAndReactions(blogId)
            if (blogs[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: blogs[0]
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log(">>> getting err when trying to get comments ", error);
            throw new InternalServerErrorException
        }
    }

    async createNewBlog(data: BlogDto, userId: string, images: string[] = []): Promise<I_Response<Blog>> {
        try {
            const newBlog = await this.blogRepo.create({ ...data, user: userId, images })
            if (newBlog) {
                const user = this.userService.addBlog(userId, newBlog._id)
                if (user) {
                    return {
                        statusCode: HttpStatus.OK,
                        data: newBlog
                    }
                }
            } throw new InternalServerErrorException

        } catch (error) {
            console.log(">>> getting err when trying to create blog ", error);
            throw new InternalServerErrorException
        }
    }

    async addComment(blogId: string, content: string, userId: string): Promise<I_Response<Blog>> {
        const checkBlog = this.checkExistedBlog(blogId)
        if (!checkBlog) {
            throw new ConflictException
        }
        try {
            const comment = await this.commentService.createComment(blogId, content, userId)
            if (comment) {
                const blog = this.blogRepo.addComment(blogId, comment._id)
                if (blog) {
                    return {
                        statusCode: HttpStatus.OK
                    }
                } throw new InternalServerErrorException
            }
        } catch (error) {
            console.log("err in add comment: ", error);
            throw new InternalServerErrorException
        }
    }

    async removeComment(data: RemoveCommentDto, userId: string): Promise<I_Response<Blog>> {
        const { blogId, commentId } = data
        const checkComment = await this.commentService.checkCommentInfo(userId, data)
        if (!checkComment) {
            throw new ConflictException
        }
        try {
            const blog = this.blogRepo.removeComment(blogId, commentId)
            if (blog) {
                return {
                    statusCode: HttpStatus.OK
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log("err in remove comment: ", error);
            throw new InternalServerErrorException
        }
    }

    async addReaction(blogId: string, userId: string): Promise<I_Response<Blog>> {
        try {
            const blog = this.blogRepo.addReaction(blogId, userId)
            if (blog) {
                return {
                    statusCode: HttpStatus.OK
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log("err in remove comment: ", error);
            throw new InternalServerErrorException
        }
    }

    async removeReaction(blogId: string, userId: string): Promise<I_Response<Blog>> {
        try {
            const blog = this.blogRepo.removeReaction(blogId, userId)
            if (blog) {
                return {
                    statusCode: HttpStatus.OK
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log("err in remove comment: ", error);
            throw new InternalServerErrorException
        }
    }

    async checkExistedBlog(blogId: string): Promise<boolean> {
        try {
            const blog = await this.blogRepo.findOneById(blogId)
            if (blog) {
                return true
            } return false
        } catch (error) {
            console.log("err in check existed blog: ", error);
            return false
        }
    }
}
