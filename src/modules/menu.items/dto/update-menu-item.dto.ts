import { IsString, IsNumber, IsOptional, IsMongoId } from 'class-validator';

export class UpdateMenuItemDto {
    @IsMongoId()
    _id: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    base_price?: number;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsMongoId()
    menu_id?: string;
} 