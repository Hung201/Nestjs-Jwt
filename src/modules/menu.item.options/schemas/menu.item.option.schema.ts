import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type MenuItemOptionDocument = HydratedDocument<MenuItemOption>;

@Schema({ timestamps: true })
export class MenuItemOption {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true })
    menu_item_id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    additional_price: number;

    @Prop()
    optional_description: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export const MenuItemOptionSchema = SchemaFactory.createForClass(MenuItemOption);
