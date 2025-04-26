import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRestaurantDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    phone?: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Đánh giá phải là số' })
    @Type(() => Number)
    @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
    @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
    rating?: number;
}
