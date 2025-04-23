import { MenuItemOption } from '@/modules/menu.item.options/schemas/menu.item.option.schema';
import { MenuItem } from '@/modules/menu.items/schemas/menu.item.schema';
import { Menu } from '@/modules/menus/schemas/menu.schema';
import { Order } from '@/modules/orders/schemas/order.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDetailDocument = HydratedDocument<OrderDetail> & {
    softDelete(): Promise<OrderDetail>;
};

@Schema({ timestamps: true })
export class OrderDetail {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
    order_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true })
    menu_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true })
    menu_item_id: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItemOption', required: true })
    menu_item_option_id: mongoose.Schema.Types.ObjectId;

    @Prop({ default: false })
    isDeleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);

OrderDetailSchema.methods.softDelete = async function (): Promise<OrderDetail> {
    this.isDeleted = true;
    return await this.save();
};
