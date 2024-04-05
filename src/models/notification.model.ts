import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    recipient: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true })
    blog: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    sender: string;

    @Prop({ required: true })
    content: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
