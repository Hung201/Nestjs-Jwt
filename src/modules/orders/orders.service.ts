import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import aqp from 'api-query-params';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const order = new this.orderModel(createOrderDto);
    const savedOrder = await order.save();
    return {
      _id: savedOrder._id,
      createdAt: savedOrder.createdAt
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.orderModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(['user_id', 'restaurant_id'])
      .populate('items.menu_item_id');

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
    return await this.orderModel.findById(id)
      .populate(['user_id', 'restaurant_id'])
      .populate('items.menu_item_id');
  }

  async update(updateOrderDto: UpdateOrderDto) {
    return await this.orderModel.updateOne(
      { _id: updateOrderDto._id },
      { ...updateOrderDto }
    );
  }

  async remove(id: string): Promise<Order> {
    return await this.orderModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}
