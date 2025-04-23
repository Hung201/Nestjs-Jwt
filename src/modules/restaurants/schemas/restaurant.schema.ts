import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant> & {
    softDelete(): Promise<Restaurant>;
};

@Schema({ timestamps: true })
export class Restaurant {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    email: string;

    @Prop({ default: 0 })
    rating: number;

    @Prop({ default: false })
    isDeleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.methods.softDelete = async function (): Promise<Restaurant> {
    this.isDeleted = true;
    return await this.save();
};
