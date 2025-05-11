import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type OrderDocument = HydratedDocument<Order> & {
    softDelete(): Promise<Order>;
};

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: mongoose.Schema.Types.ObjectId;

    @Prop({
        type: {
            full_name: String,
            phone: String,
            email: String,
            address: String,
            note: { type: String, required: false },
        },
        required: true,
    })
    shipping_info: {
        full_name: string;
        phone: string;
        email: string;
        address: string;
        note?: string;
    };

    @Prop({ type: String, enum: ['COD', 'BANK_TRANSFER', 'momo'], required: true })
    payment_method: string;

    @Prop([
        {
            menu_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
            name: String,
            quantity: Number,
            price: Number,
            option: { type: String, required: false },
        }
    ])
    items: Array<{
        menu_item_id: mongoose.Schema.Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
        option?: string;
    }>;

    @Prop({ type: Number, required: true })
    total_price: number;

    @Prop({ type: Number, required: true })
    shipping_fee: number;

    @Prop({ type: Number, required: true })
    total_amount: number;

    @Prop({
        required: true,
        enum: ['ordered', 'on the way', 'delivered'],
        default: 'ordered'
    })
    status: string;

    @Prop({ default: false })
    isDeleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.methods.softDelete = async function (): Promise<Order> {
    this.isDeleted = true;
    return await this.save();
};
