import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';

@Controller('order-detail')
export class OrderDetailController {
    constructor(private readonly orderDetailService: OrderDetailService) { }

    @Post()
    create(@Body() createOrderDetailDto: CreateOrderDetailDto) {
        return this.orderDetailService.create(createOrderDetailDto);
    }

    @Get()
    findAll(
        @Query() query: string,
        @Query('current') current: string,
        @Query('pageSize') pageSize: string,
    ) {
        return this.orderDetailService.findAll(query, +current, +pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderDetailService.findOne(id);
    }

    @Patch()
    update(@Body() updateOrderDetailDto: UpdateOrderDetailDto) {
        return this.orderDetailService.update(updateOrderDetailDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderDetailService.remove(id);
    }
} 