import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min, IsString, IsEnum } from 'class-validator';

export class CreateOrderDto {
    @IsNotEmpty({ message: 'User ID không được để trống' })
    @IsMongoId({ message: 'User ID không đúng định dạng' })
    user_id: string;

    @IsNotEmpty({ message: 'Restaurant ID không được để trống' })
    @IsMongoId({ message: 'Restaurant ID không đúng định dạng' })
    restaurant_id: string;

    @IsNotEmpty({ message: 'Tổng tiền không được để trống' })
    @IsNumber({}, { message: 'Tổng tiền phải là số' })
    @Min(0, { message: 'Tổng tiền không được âm' })
    total_price: number;

    @IsString()
    @IsEnum(['ordered', 'on the way', 'delivered'])
    @IsOptional()
    status: string;
}
