import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateMenuItemOptionDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    @IsMongoId({ message: 'Menu Item ID không đúng định dạng' })
    menu_item_id: string;

    @IsOptional()
    title: string;

    @IsOptional()
    @IsNumber({}, { message: 'Giá bổ sung phải là số' })
    @Min(0, { message: 'Giá bổ sung không được âm' })
    additional_price: number;

    @IsOptional()
    optional_description: string;
} 