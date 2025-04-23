// src/modules/menus/dto/update-menu.dto.ts
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMenuDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    @IsMongoId({ message: 'Restaurant ID không đúng định dạng' })
    restaurant_id: string;

    @IsOptional()
    title: string;

    @IsOptional()
    description: string;

    @IsOptional()
    image: string;
}