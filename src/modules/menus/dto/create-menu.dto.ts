// src/modules/menus/dto/create-menu.dto.ts
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMenuDto {
    @IsNotEmpty({ message: 'Restaurant ID không được để trống' })
    @IsMongoId({ message: 'Restaurant ID không đúng định dạng' })
    restaurant_id: string;

    @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    image: string;
}