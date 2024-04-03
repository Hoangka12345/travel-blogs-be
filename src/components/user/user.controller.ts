import { Body, Controller, Get, Param, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/verify_token.guard';
import { Request as ExpressRequest } from 'express'
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SettingDto } from './dto/setting.dto';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Get("profile/:id")
    async getProfile(
        @Param("id") userId: string
    ) {
        return this.userService.getProfile(userId)
    }

    @UseGuards(AuthGuard)
    @Get("get-saved-blog")
    async getSavedBlogs(
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']

        return this.userService.getSavedBlogs(_id)
    }

    @UseGuards(AuthGuard)
    @Put("add-saved-blog")
    async addBlogToSavedBlog(
        @Body('blogId') blogId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.userService.addBlogToSavedBlog(_id, blogId)
    }

    @UseGuards(AuthGuard)
    @Put("remove-saved-blog")
    async removeBlogToSavedBlog(
        @Body() blogId: string,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.userService.removeBlogToSavedBlog(_id, blogId)
    }

    @UseGuards(AuthGuard)
    @Put("setting")
    @UseInterceptors(FileInterceptor('avatar'))
    async setting(
        @Body() data: SettingDto,
        @Request() request: ExpressRequest,
        @UploadedFile() avatar?: Express.Multer.File
    ) {
        const { _id } = request['user']
        if (avatar.size !== 0) {
            const avatarUpload = await this.cloudinaryService.uploadAvatar(avatar)
            return this.userService.setting(_id, data, avatarUpload)
        } else {
            return this.userService.setting(_id, data)
        }
    }
}
