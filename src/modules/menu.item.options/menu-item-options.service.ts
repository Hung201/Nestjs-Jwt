import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItemOption } from './schemas/menu.item.option.schema';
import { CreateMenuItemOptionDto } from './dto/create-menu-item-option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu-item-option.dto';
import aqp from 'api-query-params';

@Injectable()
export class MenuItemOptionsService {
    constructor(
        @InjectModel(MenuItemOption.name)
        private menuItemOptionModel: Model<MenuItemOption>
    ) { }

    async create(createMenuItemOptionDto: CreateMenuItemOptionDto) {
        const menuItemOption = await this.menuItemOptionModel.create(createMenuItemOptionDto);
        return {
            _id: menuItemOption._id,
            createdAt: menuItemOption.createdAt
        };
    }

    async findAll(query: string, current: number, pageSize: number) {
        const { filter, sort } = aqp(query);
        delete filter.current;
        delete filter.pageSize;

        const offset = (+current - 1) * +pageSize;
        const defaultLimit = +pageSize ? +pageSize : 10;

        const totalItems = (await this.menuItemOptionModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.menuItemOptionModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .populate('menu_item_id');

        return {
            meta: {
                current: current,
                pageSize: pageSize,
                pages: totalPages,
                total: totalItems
            },
            result
        };
    }

    async findOne(id: string) {
        return await this.menuItemOptionModel.findById(id).populate('menu_item_id');
    }

    async update(updateMenuItemOptionDto: UpdateMenuItemOptionDto) {
        return await this.menuItemOptionModel.updateOne(
            { _id: updateMenuItemOptionDto._id },
            { ...updateMenuItemOptionDto }
        );
    }

    async remove(id: string): Promise<MenuItemOption> {
        return await this.menuItemOptionModel.findByIdAndDelete(id);
    }
} 