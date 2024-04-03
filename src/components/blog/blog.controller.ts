import { Body, Controller, Get, Param, Post, Put, Query, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { BlogService } from './blog.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BlogDto } from 'src/dtos/blog.dto';
import { RemoveCommentDto } from 'src/dtos/remove-comment.dto';

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService,
        private readonly cloudinatyService: CloudinaryService
    ) { }

    @Get()
    getBlogs(@Query('page') page: number, @Query('search') search: string) {
        return this.blogService.getBlogs(page, search)
    }

    @UseGuards(AuthGuard)
    @Get('user')
    getBlogsWhenLogin(
        @Query('page') page: number,
        @Query('search') search: string,
        @Request() request: ExpressRequest
    ) {

        const { _id } = request['user']
        return this.blogService.getBlogsWhenLogin(_id, page, search)
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    getBlogDetail(
        @Param('id') blogId: string,
        @Request() request: ExpressRequest,
    ) {
        const { _id } = request['user']

        return this.blogService.getBlogDetail(blogId, _id)
    }

    @Get('comment-reaction/:id')
    getCommentsAndReactions(
        @Param('id') blogId: string
    ) {
        return this.blogService.getCommentsAndReactions(blogId)
    }

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('images'))
    async createNewBlog(
        @Body() data: BlogDto,
        @Request() request: ExpressRequest,
        @UploadedFiles() images?: Array<Express.Multer.File>,
    ) {
        const { _id } = request['user']
        if (images[0]) {
            const imagesUpload = await this.cloudinatyService.uploadBlogFiles(images)
            return this.blogService.createNewBlog(data, _id, imagesUpload)
        } else {
            return this.blogService.createNewBlog(data, _id)
        }
    }

    @UseGuards(AuthGuard)
    @Put("add-comment/:id")
    async addComment(
        @Param('id') blogId: string,
        @Body('content') content: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.blogService.addComment(blogId, content, _id)
    }

    @UseGuards(AuthGuard)
    @Put("remove-comment")
    async removeComment(
        @Body() data: RemoveCommentDto,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.blogService.removeComment(data, _id)
    }

    @UseGuards(AuthGuard)
    @Put("add-reaction/:id")
    async addReaction(
        @Param('id') blogId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.blogService.addReaction(blogId, _id)
    }

    @UseGuards(AuthGuard)
    @Put("remove-reaction/:id")
    async removeReaction(
        @Param('id') blogId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.blogService.removeReaction(blogId, _id)
    }
}
