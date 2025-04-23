import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsMongoId } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsMongoId()
    _id: string;
}
