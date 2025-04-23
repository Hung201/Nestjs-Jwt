import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderDetailService } from './order-detail.service';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetail, OrderDetailSchema } from './schemas/order.detail.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: OrderDetail.name, schema: OrderDetailSchema }])
    ],
    controllers: [OrderDetailController],
    providers: [OrderDetailService],
    exports: [OrderDetailService]
})
export class OrderDetailModule { } 