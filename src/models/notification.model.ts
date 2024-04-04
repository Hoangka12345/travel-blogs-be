import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    content: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true })
    blog: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    sender: string;

    @Prop({ required: true })
    recipient: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
