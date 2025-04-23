import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateRestaurantDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    name: string;

    @IsOptional()
    address: string;

    @IsOptional()
    @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
    phone: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email không hợp lệ' })
    email: string;
}
