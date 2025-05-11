import {
    IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min, IsString, IsEnum, ValidateNested, IsArray
} from 'class-validator';
import { Type } from 'class-transformer';

class ShippingInfoDto {
    @IsNotEmpty()
    @IsString()
    full_name: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    note?: string;
}

class OrderItemDto {
    @IsNotEmpty()
    @IsMongoId()
    menu_item_id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsOptional()
    @IsString()
    option?: string;
}

export class CreateOrderDto {
    @IsNotEmpty()
    @IsMongoId()
    user_id: string;

    @IsNotEmpty()
    @IsMongoId()
    restaurant_id: string;

    @ValidateNested()
    @Type(() => ShippingInfoDto)
    shipping_info: ShippingInfoDto;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['COD', 'BANK_TRANSFER', 'momo'])
    payment_method: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNotEmpty()
    @IsNumber()
    total_price: number;

    @IsNotEmpty()
    @IsNumber()
    shipping_fee: number;

    @IsNotEmpty()
    @IsNumber()
    total_amount: number;

    @IsOptional()
    @IsString()
    @IsEnum(['ordered', 'on the way', 'delivered'])
    status?: string;
}
