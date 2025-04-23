import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Restaurant } from 'src/modules/restaurants/schemas/restaurant.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export type ReviewDocument = Review & Document & {
    softDelete(): Promise<Review>;
};

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: Restaurant;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user_id: User;

    @Prop({ required: true, min: 1, max: 5 })
    rating: number;

    @Prop()
    comment: string;

    @Prop({ default: false })
    isDeleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.methods.softDelete = async function (): Promise<Review> {
    this.isDeleted = true;
    return await this.save();
};