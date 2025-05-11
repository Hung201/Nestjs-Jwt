import { Controller, Post, Body, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MomoCallbackDto } from './dto/momo-callback.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('payment')
export class PaymentController {
    private readonly frontendUrl: string;

    constructor(
        private readonly paymentService: PaymentService,
        private readonly configService: ConfigService
    ) {
        this.frontendUrl = this.configService.get<string>('MOMO_RETURN_URL');
    }

    @Post('momo')
    async createMoMoPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentService.createMoMoPayment(
            createPaymentDto.amount,
            createPaymentDto.orderInfo,
        );
    }

    @Public()
    @Get('momo/callback')
    async handleMomoCallback(
        @Query() query: MomoCallbackDto,
        @Res() res: Response
    ) {
        const result = await this.paymentService.handleMomoCallback(query);

        if (result.statusCode === 200) {
            // Redirect to frontend URL on success
            return res.redirect(`${this.frontendUrl}?status=success`);
        } else {
            // Redirect to frontend URL with error
            return res.redirect(`${this.frontendUrl}?status=error&message=${encodeURIComponent(result.message)}`);
        }
    }

    @Public()
    @Post('momo/callback')
    async handleMomoIpn(@Body() callbackData: MomoCallbackDto) {
        return this.paymentService.handleMomoCallback(callbackData);
    }
} 