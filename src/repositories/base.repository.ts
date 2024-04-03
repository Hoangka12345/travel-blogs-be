import { Document, Model } from "mongoose";

export class BaseRepository<T extends Document> {
    constructor(
        private model: Model<T>
    ) { }

    public async count(condition?: any): Promise<number> {
        return await this.model.countDocuments({ ...condition }).exec();
    }

    public async findAll(): Promise<T[]> {
        return await this.model.find().exec()
    }

    public async findAllByCondition(
        filterCondition: any = {},
        skip: number,
        limit: number,
        populateField?: string,
        selectFields?: string[]
    ): Promise<T[]> {
        const query = this.model.find({ ...filterCondition }).sort({ createdAt: -1 });
        if (skip) {
            query.skip(skip);
        }
        if (limit) {
            query.limit(limit);
        }
        if (populateField && selectFields) {
            query.populate(populateField, selectFields)
        }
        return await query.lean();
    }

    public async findOneById(_id: string) {
        return await this.model.findById({ _id }).exec()
    }

    public async findOneByCondition(filterCondition: any): Promise<T> {
        return await this.model.findOne({ ...filterCondition }).exec()
    }

    public async findOneWithPopulate(
        condition: any,
        populateField: string,
        selectFields: string[] = []
    ): Promise<T> {
        return await this.model
            .findOne({ ...condition })
            .populate(populateField, selectFields)
            .lean();
    }

    public async create(data: T | any): Promise<T> {
        return await this.model.create(data);
    }

    public async updateById(_id: T | any, data: T | any) {
        return await this.model.findByIdAndUpdate({ _id }, data, {
            new: true,
        });
    }

    public async deleteById(_id: T | any): Promise<any> {
        return await this.model.deleteOne({ _id });
    }
}