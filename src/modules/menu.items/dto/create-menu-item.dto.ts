import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMenuItemDto {
    @IsNotEmpty({ message: 'Menu ID không được để trống' })
    @IsMongoId({ message: 'Menu ID không đúng định dạng' })
    menu_id: string;

    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title: string;

    @IsOptional()
    description: string;

    @IsNotEmpty({ message: 'Giá không được để trống' })
    @IsNumber({}, { message: 'Giá phải là số' })
    @Min(0, { message: 'Giá không được âm' })
    base_price: number;

    @IsOptional()
    image: string;
} 