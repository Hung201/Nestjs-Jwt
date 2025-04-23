import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu } from './schemas/menu.schema';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import aqp from 'api-query-params';

@Injectable()
export class MenusService {
  constructor(
    @InjectModel(Menu.name)
    private menuModel: Model<Menu>
  ) { }

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    const menu = new this.menuModel(createMenuDto);
    const savedMenu = await menu.save();
    return {
      ...savedMenu.toObject(),
      createdAt: savedMenu.createdAt
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.menuModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.menuModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate('restaurant_id');

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
    return await this.menuModel.findById(id).populate('restaurant_id');
  }

  async update(updateMenuDto: UpdateMenuDto) {
    return await this.menuModel.updateOne(
      { _id: updateMenuDto._id },
      { ...updateMenuDto }
    );
  }

  async remove(id: string): Promise<Menu> {
    return await this.menuModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}
