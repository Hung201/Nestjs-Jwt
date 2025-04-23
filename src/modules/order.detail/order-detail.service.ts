import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDetail } from './schemas/order.detail.schema';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import aqp from 'api-query-params';

@Injectable()
export class OrderDetailService {
    constructor(
        @InjectModel(OrderDetail.name)
        private orderDetailModel: Model<OrderDetail>
    ) { }

    async create(createOrderDetailDto: CreateOrderDetailDto): Promise<OrderDetail> {
        const orderDetail = new this.orderDetailModel(createOrderDetailDto);
        const savedOrderDetail = await orderDetail.save();
        return {
            ...savedOrderDetail.toObject(),
            createdAt: savedOrderDetail.createdAt
        };
    }

    async findAll(query: string, current: number, pageSize: number) {
        const { filter, sort } = aqp(query);
        delete filter.current;
        delete filter.pageSize;

        const offset = (+current - 1) * +pageSize;
        const defaultLimit = +pageSize ? +pageSize : 10;

        const totalItems = (await this.orderDetailModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.orderDetailModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .populate(['order_id', 'menu_id', 'menu_item_id', 'menu_item_option_id']);

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
        return await this.orderDetailModel.findById(id)
            .populate(['order_id', 'menu_id', 'menu_item_id', 'menu_item_option_id']);
    }

    async update(updateOrderDetailDto: UpdateOrderDetailDto) {
        return await this.orderDetailModel.updateOne(
            { _id: updateOrderDetailDto._id },
            { ...updateOrderDetailDto }
        );
    }

    async remove(id: string): Promise<OrderDetail> {
        return await this.orderDetailModel.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
    }
} 