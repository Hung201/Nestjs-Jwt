import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOrderDetailDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    @IsMongoId({ message: 'Order ID không đúng định dạng' })
    order_id: string;

    @IsOptional()
    @IsMongoId({ message: 'Menu ID không đúng định dạng' })
    menu_id: string;

    @IsOptional()
    @IsMongoId({ message: 'Menu Item ID không đúng định dạng' })
    menu_item_id: string;

    @IsOptional()
    @IsMongoId({ message: 'Menu Item Option ID không đúng định dạng' })
    menu_item_option_id: string;
} 