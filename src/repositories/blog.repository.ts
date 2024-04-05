import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { BaseRepository } from "./base.repository";
import { Blog } from "src/models/blog.model";

@Injectable()
export class BlogRepository extends BaseRepository<Blog> {
    constructor(
        @InjectModel(Blog.name)
        private readonly blogModel: Model<Blog>
    ) {
        super(blogModel)
    }

    async getBlogsWhenLogin(regex: string, userId: string, page: number): Promise<Blog[]> {
        return await this.blogModel.aggregate([
            {
                $addFields: {
                    userId: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            {
                $unwind: '$userInfo',
            },
            {
                $addFields: {
                    isSaved: {
                        $in: ['$_id', '$userInfo.savedBlogs'],
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    userId: 0,
                    userInfo: 0
                },
            },
            {
                $skip: (page - 1) * 5
            },
            {
                $limit: 5
            },
            {
                $sort: { createdAt: -1 }
            }
        ]).exec()
    }

    async getBlogsOfUser(page: number, userId: string): Promise<Blog[]> {
        try {
            const blogs = await this.findAllByCondition(
                { user: new mongoose.Types.ObjectId(userId) },
                (page - 1) * 5, 5, "user", ["_id", "fullName", "avatar"]
            )
            if (blogs[0]) {
                return blogs

            } return []
        } catch (error) {
            console.log(">>> getting err when trying to get blogs ", error);
            throw new HttpException("Lỗi server", HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getBlogDetail(blogId: string, userId: string): Promise<Blog[]> {
        return await this.blogModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(blogId) }
            },
            {
                $addFields: {
                    isLike: {
                        $cond: [{ $in: [new mongoose.Types.ObjectId(userId), "$reactions"] }, true, false]
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $addFields: {
                    isSaved: {
                        $cond: [{ $in: [userId, "$userInfo.savedBlogs"] }, true, false]
                    }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    address: { $first: "$address" },
                    country: { $first: "$country" },
                    city: { $first: "$city" },
                    content: { $first: "$content" },
                    images: { $first: "$images" },
                    createdAt: { $first: "$createdAt" },
                    isLike: { $first: "$isLike" },
                    isSaved: { $first: "$isSaved" },
                    user: {
                        $first: {
                            _id: "$userInfo._id",
                            fullName: "$userInfo.fullName",
                            avatar: "$userInfo.avatar"
                        }
                    }
                }
            },
        ]).exec()
    }

    async getCommentsAndReactions(blogId: string): Promise<Blog[]> {
        return await this.blogModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(blogId) }
            },
            {
                $addFields: {
                    commentNumber: { $size: "$comments" },
                }
            },
            {
                $addFields: {
                    reactionNumber: { $size: "$reactions" },
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'comments',
                    foreignField: '_id',
                    as: 'commentDetails'
                }
            },
            {
                $unwind: {
                    path: '$commentDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'commentDetails.user',
                    foreignField: '_id',
                    as: 'commentDetails.userDetails'
                }
            },
            {
                $unwind: {
                    path: '$commentDetails.userDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    commentNumber: { $first: "$commentNumber" },
                    reactionNumber: { $first: "$reactionNumber" },
                    comments: {
                        $push: {
                            $cond: {
                                if: { $gt: ["$commentNumber", 0] }, // Kiểm tra nếu commentNumber lớn hơn 0
                                then: { // Nếu có comment, push thông tin comment
                                    _id: "$commentDetails._id",
                                    content: "$commentDetails.content",
                                    createdAt: "$commentDetails.createdAt",
                                    user: {
                                        _id: '$commentDetails.userDetails._id',
                                        fullName: '$commentDetails.userDetails.fullName',
                                        avatar: '$commentDetails.userDetails.avatar'
                                    }
                                },
                                else: "$$REMOVE" // Nếu không có comment, không push gì cả
                            }
                        }
                    }
                }
            },
        ]).exec();
    }

    async countReactions(blogId: string): Promise<Blog[]> {
        return await this.blogModel.aggregate([
            {
                $match: { _id: blogId }
            },
            {
                $addFields: {
                    reactionNumber: { $size: "reactions" }
                }
            },
            {
                $project: {
                    _id: 1,
                    reactionNumber: 1
                }
            }
        ]).exec()
    }

    async addComment(blogId: string, commentId: string) {
        return await this.blogModel.findOneAndUpdate({ _id: blogId },
            {
                $push: {
                    comments: commentId
                }
            },
            {
                new: true
            },
        ).populate({
            path: 'comments',
            populate: {
                path: 'user',
                model: 'User'
            }
        })
    }

    async removeComment(blogId: string, commentId: string) {
        return await this.blogModel.findOneAndUpdate({ _id: blogId },
            {
                $pull: {
                    comments: commentId
                }
            },
            {
                new: true
            },
        )
    }

    async addReaction(blogId: string, userId: string) {
        return await this.blogModel.findOneAndUpdate({ _id: blogId },
            {
                $push: {
                    reactions: userId
                }
            },
            {
                new: true
            },
        )
    }

    async removeReaction(blogId: string, userId: string) {
        return await this.blogModel.findOneAndUpdate({ _id: blogId },
            {
                $pull: {
                    reactions: userId
                }
            },
            {
                new: true
            },
        )
    }
}