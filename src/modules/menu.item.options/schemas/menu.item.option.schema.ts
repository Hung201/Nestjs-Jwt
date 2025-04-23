import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type MenuItemOptionDocument = HydratedDocument<MenuItemOption> & {
    softDelete(): Promise<MenuItemOption>;
};

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

    @Prop({ default: false })
    isDeleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const MenuItemOptionSchema = SchemaFactory.createForClass(MenuItemOption);

MenuItemOptionSchema.methods.softDelete = async function (): Promise<MenuItemOption> {
    this.isDeleted = true;
    return await this.save();
};
