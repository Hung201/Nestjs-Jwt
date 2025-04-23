import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateRestaurantDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
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
