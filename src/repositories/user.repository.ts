import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { User } from "src/models/user.model";
import { BaseRepository } from "./base.repository";
import { RegisterDto } from "src/dtos/register.dto";
import { LoginDto } from "src/dtos/login.dto";
import { Blog } from "src/models/blog.model";
import { BlogDto } from "src/dtos/blog.dto";

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>
    ) {
        super(userModel)
    }

    async getTopContributors() {
        return await this.userModel.aggregate([
            {
                $addFields: {
                    totalBlogs: { $size: "$blogs" }
                }
            },
            {
                $sort: { totalBlogs: -1 }
            },
            {
                $project: {
                    fullName: 1,
                    avatar: 1,
                    createdAt: 1,
                    totalBlogs: 1
                }
            },
            {
                $limit: 5
            }
        ]);
    }

    async getSavedBlogs(userId: string) {

        return await this.userModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: "blogs",
                    localField: "savedBlogs",
                    foreignField: "_id",
                    let: { user: '$user' },
                    as: "savedBlogs"
                    , pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user"

                            }
                        },
                        {
                            $unwind: {
                                path: "$user",
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ]
                }
            }
        ]).exec()
    }

    async addBlog(userId: string, blogId: string): Promise<User> {
        return await this.userModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) },
            {
                $push: {
                    blogs: new mongoose.Types.ObjectId(blogId)
                }
            },
            {
                new: true
            },
        )
    }

    async addBlogToSavedBlog(blogId: string, userId: string): Promise<User> {
        return await this.userModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) },
            {
                $push: {
                    savedBlogs: new mongoose.Types.ObjectId(blogId)
                }
            },
            {
                new: true
            },
        )
    }

    async removeBlogFromSavedBlog(blogId: string, userId: string) {
        return await this.userModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) },
            {
                $pull: {
                    savedBlogs: blogId
                }
            },
            {
                new: true
            },
        )
    }
}