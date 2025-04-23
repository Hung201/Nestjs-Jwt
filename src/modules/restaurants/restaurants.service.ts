import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import aqp from 'api-query-params';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>
  ) { }

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = new this.restaurantModel(createRestaurantDto);
    const savedRestaurant = await restaurant.save();
    return {
      ...savedRestaurant.toObject(),
      createdAt: savedRestaurant.createdAt
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.restaurantModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.restaurantModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any);

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
    return await this.restaurantModel.findById(id);
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
    return await this.restaurantModel.updateOne(
      { _id: updateRestaurantDto._id },
      { ...updateRestaurantDto }
    );
  }

  async remove(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}
