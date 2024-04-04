import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotificationDto } from 'src/dtos/notification.dto';
import { I_Response } from 'src/interfaces/response-data.interface';
import { Blog } from 'src/models/blog.model';
import { Notification } from 'src/models/notification.model';
import { BlogRepository } from 'src/repositories/blog.repository';
import { NotificationRepository } from 'src/repositories/notification.repository';

@Injectable()
export class NotificationService {
    constructor(
        private readonly notificationRepo: NotificationRepository,
        private readonly blogRepo: BlogRepository
    ) { }

    async getNotifications(userId: string): Promise<I_Response<Notification>> {
        try {
            const notifications = await this.notificationRepo.getAllNotifications(userId)
            if (notifications[0]) {
                return {
                    statusCode: HttpStatus.OK,
                    data: notifications
                }
            } return {
                statusCode: HttpStatus.OK,
                data: []
            }
        } catch (error) {
            console.log(">>>error in get notification: ", error);
            throw new InternalServerErrorException
        }
    }

    private async getBlogInfo(blogId: string): Promise<Blog> {
        try {
            const blog = await this.blogRepo.findOneById(blogId)
            if (blog) {
                return blog
            }
        } catch (error) {

        }
    }

    async createNotifications(userId: string, data: NotificationDto): Promise<I_Response<Notification>> {
        const { blog } = data
        const blogInfo = await this.getBlogInfo(blog)
        if (blog) {
            const { user } = blogInfo
            try {
                const notification = await this.notificationRepo.create({ ...data, recipient: user, sender: userId })
                if (notification) {
                    return {
                        statusCode: HttpStatus.OK,
                        data: notification
                    }
                }
            } catch (error) {
                console.log(">>>error in create notification: ", error);
                throw new InternalServerErrorException
            }
        }
    }

    async deleteNotifications(_id: string): Promise<I_Response<Notification>> {
        try {
            const notification = await this.notificationRepo.deleteById(_id)
            if (notification) {
                return {
                    statusCode: HttpStatus.OK
                }
            }
        } catch (error) {
            console.log(">>>error in create notification: ", error);
            throw new InternalServerErrorException
        }
    }
}
