import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as https from 'https';
import { MomoCallbackDto } from './dto/momo-callback.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
    private readonly accessKey = 'F8BBA842ECF85';
    private readonly secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    private readonly partnerCode = 'MOMO';
    private readonly redirectUrl: string;
    private readonly ipnUrl: string;

    constructor(private configService: ConfigService) {
        this.redirectUrl = this.configService.get<string>('MOMO_RETURN_URL');
        this.ipnUrl = this.configService.get<string>('MOMO_NOTIFY_URL');
    }

    async createMoMoPayment(amount: number, orderInfo: string) {
        const orderId = this.partnerCode + new Date().getTime();
        const requestId = orderId;
        const requestType = 'payWithMethod';
        const extraData = '';
        const orderGroupId = '';
        const autoCapture = true;
        const lang = 'vi';

        const rawSignature = `accessKey=${this.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

        const signature = crypto
            .createHmac('sha256', this.secretKey)
            .update(rawSignature)
            .digest('hex');

        const requestBody = JSON.stringify({
            partnerCode: this.partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount.toString(),
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: this.redirectUrl,
            ipnUrl: this.ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
        });

        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'test-payment.momo.vn',
                port: 443,
                path: '/v2/gateway/api/create',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(requestBody),
                },
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.write(requestBody);
            req.end();
        });
    }

    async handleMomoCallback(callbackData: MomoCallbackDto) {
        try {
            // Verify signature
            const rawSignature = `partnerCode=${callbackData.partnerCode}&orderId=${callbackData.orderId}&requestId=${callbackData.requestId}&amount=${callbackData.amount}&orderInfo=${callbackData.orderInfo}&orderType=${callbackData.orderType}&transId=${callbackData.transId}&resultCode=${callbackData.resultCode}&message=${callbackData.message}&payType=${callbackData.payType}`;

            const signature = crypto
                .createHmac('sha256', this.secretKey)
                .update(rawSignature)
                .digest('hex');

            if (signature !== callbackData.signature) {
                throw new Error('Invalid signature');
            }

            // Process payment result
            if (callbackData.resultCode === 0) {
                // Payment successful
                // Update your database, send notification, etc.
                return {
                    statusCode: 200,
                    message: 'Payment processed successfully'
                };
            } else {
                // Payment failed
                return {
                    statusCode: 400,
                    message: callbackData.message
                };
            }
        } catch (error) {
            return {
                statusCode: 500,
                message: error.message
            };
        }
    }
} 