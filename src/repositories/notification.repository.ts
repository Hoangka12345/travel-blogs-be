import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { Notification } from "src/models/notification.model";

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
    constructor(
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<Notification>
    ) {
        super(notificationModel)
    }

    async getAllNotifications(userId: string) {
        return await this.notificationModel.find({ recipient: userId })
    }
}