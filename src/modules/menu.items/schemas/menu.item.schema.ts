import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type MenuItemDocument = HydratedDocument<MenuItem> & {
    softDelete(): Promise<MenuItem>;
};

@Schema({ timestamps: true })
export class MenuItem {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true })
    menu_id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    base_price: number;

    @Prop()
    image: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
