import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MenuItem } from './schemas/menu.item.schema';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import aqp from 'api-query-params';

@Injectable()
export class MenuItemsService {
    constructor(
        @InjectModel(MenuItem.name)
        private menuItemModel: Model<MenuItem>
    ) { }

    async create(createMenuItemDto: CreateMenuItemDto) {
        const menuItem = await this.menuItemModel.create(createMenuItemDto);
        return {
            _id: menuItem._id,
            createdAt: menuItem.createdAt
        };
    }

    async findAll(query: string, current: number, pageSize: number) {
        const { filter, sort } = aqp(query);
        delete filter.current;
        delete filter.pageSize;

        const offset = (+current - 1) * +pageSize;
        const defaultLimit = +pageSize ? +pageSize : 10;

        const totalItems = (await this.menuItemModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);

        const result = await this.menuItemModel
            .find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort as any)
            .populate('menu_id');

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
        return await this.menuItemModel.findById(id).populate('menu_id');
    }

    async update(updateMenuItemDto: UpdateMenuItemDto) {
        return await this.menuItemModel.updateOne(
            { _id: updateMenuItemDto._id },
            { ...updateMenuItemDto }
        );
    }

    async remove(id: string): Promise<MenuItem> {
        return await this.menuItemModel.findByIdAndDelete(id);
    }
} 