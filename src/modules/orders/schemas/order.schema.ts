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

    @Prop({ required: true })
    total_price: number;

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
