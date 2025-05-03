import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsNumber, Min, Max, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRestaurantDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    phone: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;

    @IsOptional()
    @IsNumber({}, { message: 'Đánh giá phải là số' })
    @Type(() => Number)
    @Min(1, { message: 'Đánh giá tối thiểu là 1 sao' })
    @Max(5, { message: 'Đánh giá tối đa là 5 sao' })
    rating?: number;

    @IsOptional()
    image?: string;

    @IsNotEmpty({ message: 'User ID không được để trống' })
    @IsMongoId({ message: 'User ID không đúng định dạng' })
    user_id: string;
}
