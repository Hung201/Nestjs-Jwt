// src/modules/menus/schemas/menu.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type MenuDocument = HydratedDocument<Menu> & {
    softDelete(): Promise<Menu>;
};

@Schema({ timestamps: true })
export class Menu {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop()
    image: string;

    @Prop({ default: false })
    isDeleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

MenuSchema.methods.softDelete = async function (): Promise<Menu> {
    this.isDeleted = true;
    return await this.save();
};