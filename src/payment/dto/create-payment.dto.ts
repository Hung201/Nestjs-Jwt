import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
    @IsNumber()
    amount: number;

    @IsString()
    orderInfo: string;
} 