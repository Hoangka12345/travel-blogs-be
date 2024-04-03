import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { Comment } from "src/models/comment.model";
import { Blog } from "src/models/blog.model";

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentModel: Model<Comment>
    ) {
        super(commentModel)
    }
}