import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from 'src/dtos/notification.dto';
import { Request as ExpressRequest } from 'express';
import { AuthGuard } from 'src/guards/verify_token.guard';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) { }

    @UseGuards(AuthGuard)
    @Get()
    getNotifications(
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.notificationService.getNotifications(_id)
    }

    @UseGuards(AuthGuard)
    @Post()
    createNotification(
        @Body() data: NotificationDto,
        @Request() request: ExpressRequest
    ) {
        const { _id } = request['user']
        return this.notificationService.createNotifications(_id, data)
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    deleteNotification(
        @Param('id') _id: string,
    ) {
        return this.notificationService.deleteNotifications(_id)
    }
}
