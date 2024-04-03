import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { I_Response } from 'src/interfaces/response-data.interface';
import { User } from 'src/models/user.model';
import { UserRepository } from 'src/repositories/user.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SettingDto } from './dto/setting.dto';
import { AuthRepository } from 'src/repositories/auth.repository';
import { AuthService } from '../auth/auth.service';
import mongoose from 'mongoose';
import { BlogService } from '../blog/blog.service';
import { BlogRepository } from 'src/repositories/blog.repository';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly authService: AuthService,
        private readonly cloudinaryService: CloudinaryService,
        private readonly blogRepo: BlogRepository,
    ) { }

    async getProfile(userId: string): Promise<I_Response<any>> {
        try {
            const user = await this.userRepo.findOneById(userId)
            if (user) {
                const blogs = await this.blogRepo.getBlogsOfUser(1, userId)
                return {
                    statusCode: HttpStatus.OK,
                    data: { user, blogs }
                }
            } return {
                statusCode: HttpStatus.FOUND,
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException
        }
    }

    async getSavedBlogs(userId: string): Promise<I_Response<User>> {
        try {
            const user = await this.userRepo.getSavedBlogs(userId)
            if (user[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: user[0]
                }
            } return {
                statusCode: HttpStatus.FOUND,
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException
        }
    }

    async addBlog(userId: string, blogId: string): Promise<User> {
        try {
            const user = await this.userRepo.addBlog(userId, blogId)
            if (user) {
                return user
            } null
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException
        }
    }

    private async checkExistBlog(userId: string, blogId: String): Promise<boolean> {
        try {
            const user = await this.userRepo.findOneByCondition({ _id: new mongoose.Types.ObjectId(userId), savedBlogs: { $in: [blogId] } })
            console.log(user);
            return !!user
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException
        }
    }

    async addBlogToSavedBlog(userId: string, blogId: string): Promise<I_Response<User>> {
        const checkBlog = await this.checkExistBlog(userId, blogId)
        if (checkBlog) {
            throw new HttpException("Blog này đã được lưu!", HttpStatus.CONFLICT)
        }
        try {
            const user = await this.userRepo.addBlogToSavedBlog(blogId, userId)
            if (user) {
                return {
                    statusCode: HttpStatus.OK,
                    data: user
                }
            } return {
                statusCode: HttpStatus.OK,
                data: []
            }
        } catch (error) {
            console.log("err in add saved blog: ", error);
            throw new InternalServerErrorException
        }
    }

    async removeBlogToSavedBlog(userId: string, blogId: string): Promise<I_Response<User>> {
        const checkBlog = await this.checkExistBlog(userId, blogId)
        if (!checkBlog) {
            throw new HttpException("Blog này không tồn tại trong danh sách lưu!", HttpStatus.CONFLICT)
        }
        try {
            const user = await this.userRepo.removeBlogFromSavedBlog(blogId, userId)
            if (user) {
                return {
                    statusCode: HttpStatus.OK
                }
            } throw new InternalServerErrorException
        } catch (error) {
            console.log("err in add saved blog: ", error);
            throw new InternalServerErrorException
        }
    }

    private async getUserInfo(userId: string): Promise<User> {
        try {
            const user = await this.userRepo.findOneById(userId)
            return user
        } catch (error) {
            console.log("err in find user: ", error);
            throw new ConflictException
        }
    }

    async updateUserPassword(userId: string, data: SettingDto, password: string): Promise<User> {
        const { oldPassword, newPassword } = data
        const checkPassword = await this.authService.comparePassword(oldPassword, password)
        if (!checkPassword) {
            throw new HttpException("Mật khẩu không đúng!", HttpStatus.CONFLICT)
        }
        const newHashPassword = await this.authService.hashPassword(newPassword)
        if (newHashPassword) {
            try {
                const user = await this.userRepo.updateById(userId, { password: newHashPassword })
                return user
            } catch (error) {
                console.log("err in update user's password: ", error);
                throw new InternalServerErrorException
            }
        }
    }

    async updateUserAvatar(userId: string, avatar: string, newAvatar: String): Promise<User> {
        try {
            const user = await this.userRepo.updateById(userId, { avatar: newAvatar })
            await this.cloudinaryService.deleteFile(avatar)
            return user
        } catch (error) {
            console.log("err in update user's avatar: ", error);
            throw new InternalServerErrorException
        }
    }

    async updateUserPasswordAndAvatar(userId: string, data: SettingDto, password: string, avatar: string, newAvatar: string): Promise<User> {
        const userUpdatePassword = await this.updateUserPassword(userId, data, password)
        if (userUpdatePassword) {
            const userUpdateAvatar = await this.updateUserAvatar(userId, avatar, newAvatar)
            if (userUpdateAvatar) {
                return userUpdateAvatar
            }
        }
    }

    async setting(userId: string, data: SettingDto, newAvatar?: string): Promise<I_Response<User>> {
        const userInfo = await this.getUserInfo(userId)
        if (userId) {
            const { password, avatar } = userInfo
            const { oldPassword, newPassword } = data
            if (oldPassword && newPassword && !newAvatar) {
                const user = await this.updateUserPassword(userId, data, password)
                if (user) return { statusCode: HttpStatus.OK }
            } else if (!oldPassword && !newPassword && newAvatar) {
                const user = await this.updateUserAvatar(userId, avatar, newAvatar)
                if (user) return { statusCode: HttpStatus.OK }
            } else if (oldPassword && newPassword && newAvatar) {
                const user = await this.updateUserPasswordAndAvatar(userId, data, password, avatar, newAvatar)
                if (user) return { statusCode: HttpStatus.OK }
            }
        }
    }
}
