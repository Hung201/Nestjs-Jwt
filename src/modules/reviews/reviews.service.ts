import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import aqp from 'api-query-params';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: Model<ReviewDocument>
  ) { }

  async create(createReviewDto: CreateReviewDto) {
    const review = await this.reviewModel.create(createReviewDto);
    return {
      _id: review._id,
      createdAt: review.createdAt
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    const finalFilter = { ...filter, isDeleted: { $ne: true } };

    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.reviewModel.find(finalFilter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.reviewModel
      .find(finalFilter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(['restaurant_id', 'user_id']);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems
      },
      result
    };
  }

  async findOne(id: string) {
    return await this.reviewModel.findOne({ _id: id, isDeleted: { $ne: true } })
      .populate(['restaurant_id', 'user_id']);
  }

  async update(updateReviewDto: UpdateReviewDto) {
    return await this.reviewModel.updateOne(
      { _id: updateReviewDto._id, isDeleted: { $ne: true } },
      { ...updateReviewDto }
    );
  }

  async remove(id: string) {
    const review = await this.reviewModel.findById(id);
    if (!review) return null;
    return await review.softDelete();
  }
}
