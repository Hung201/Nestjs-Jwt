import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMenuItemOptionDto {
    @IsNotEmpty({ message: 'Menu Item ID không được để trống' })
    @IsMongoId({ message: 'Menu Item ID không đúng định dạng' })
    menu_item_id: string;

    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title: string;

    @IsNotEmpty({ message: 'Giá bổ sung không được để trống' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Giá bổ sung phải là số' })
    @Min(0, { message: 'Giá bổ sung không được âm' })
    additional_price: number;

    @IsOptional()
    optional_description: string;
} 