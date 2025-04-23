import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDetailDto {
    @IsNotEmpty({ message: 'Order ID không được để trống' })
    @IsMongoId({ message: 'Order ID không đúng định dạng' })
    order_id: string;

    @IsNotEmpty({ message: 'Menu ID không được để trống' })
    @IsMongoId({ message: 'Menu ID không đúng định dạng' })
    menu_id: string;

    @IsNotEmpty({ message: 'Menu Item ID không được để trống' })
    @IsMongoId({ message: 'Menu Item ID không đúng định dạng' })
    menu_item_id: string;

    @IsOptional()
    @IsMongoId({ message: 'Menu Item Option ID không đúng định dạng' })
    menu_item_option_id: string;
} 