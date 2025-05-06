import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { Menu } from '../menus/schemas/menu.schema';
import { MenuItem } from '../menu.items/schemas/menu.item.schema';
import { MenuItemOption } from '../menu.item.options/schemas/menu.item.option.schema';
import { Review } from '../reviews/schemas/review.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>,
    @InjectModel(Menu.name)
    private menuModel: Model<Menu>,
    @InjectModel(MenuItem.name)
    private menuItemModel: Model<MenuItem>,
    @InjectModel(MenuItemOption.name)
    private menuItemOptionModel: Model<MenuItemOption>,
    @InjectModel(Review.name)
    private reviewModel: Model<Review>
  ) { }

  async create(createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.restaurantModel.create(createRestaurantDto);
    return {
      _id: restaurant._id,
      createdAt: restaurant.createdAt
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    try {
      const { filter, sort } = aqp(query);
      delete filter.current;
      delete filter.pageSize;

      // Kiểm tra và chuyển đổi user_id thành ObjectId nếu có
      if (filter.user_id) {
        if (Array.isArray(filter.user_id)) {
          filter.user_id = filter.user_id[0];
        }
        if (typeof filter.user_id === 'string') {
          // Loại bỏ tất cả ký tự không phải hex
          filter.user_id = filter.user_id.replace(/[^a-fA-F0-9]/g, '');
        }
        if (typeof filter.user_id === 'string' && /^[a-fA-F0-9]{24}$/.test(filter.user_id)) {
          filter.user_id = new mongoose.Types.ObjectId(filter.user_id);
        } else {
          throw new BadRequestException('User ID không hợp lệ');
        }
      }

      const offset = (+current - 1) * +pageSize;
      const defaultLimit = +pageSize ? +pageSize : 8;

      const totalItems = (await this.restaurantModel.find(filter)).length;
      const totalPages = Math.ceil(totalItems / defaultLimit);

      const result = await this.restaurantModel
        .find(filter)
        .skip(offset)
        .limit(defaultLimit)
        .sort(sort as any)
        .populate('user_id');

      return {
        meta: {
          current: current,
          pageSize: pageSize,
          pages: totalPages,
          total: totalItems
        },
        result
      };
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new BadRequestException('ID không hợp lệ');
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.restaurantModel.findById(id).populate('user_id');
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new BadRequestException('ID không hợp lệ');
      }
      throw error;
    }
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
    try {
      return await this.restaurantModel.updateOne(
        { _id: updateRestaurantDto._id },
        { ...updateRestaurantDto }
      );
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new BadRequestException('ID không hợp lệ');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Restaurant> {
    try {
      return await this.restaurantModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        throw new BadRequestException('ID không hợp lệ');
      }
      throw error;
    }
  }

  async findOneWithDetails(id: string) {
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new BadRequestException('Restaurant not found');
    }

    // Get all menus for this restaurant
    const menus = await this.menuModel.find({ restaurant_id: id, isDeleted: { $ne: true } });

    // Get all menu items for these menus
    const menuItems = await this.menuItemModel.find({
      menu_id: { $in: menus.map(menu => menu._id) },
      isDeleted: { $ne: true }
    });

    // Get all menu item options for these menu items
    const menuItemOptions = await this.menuItemOptionModel.find({
      menu_item_id: { $in: menuItems.map(item => item._id) },
      isDeleted: { $ne: true }
    });

    // Get all reviews for this restaurant
    const reviews = await this.reviewModel.find({
      restaurant_id: id,
      isDeleted: { $ne: true }
    }).populate('user_id');

    // Organize the data
    const organizedMenus = menus.map(menu => {
      const menuItemsForMenu = menuItems.filter(item => item.menu_id.toString() === menu._id.toString());
      const menuItemsWithOptions = menuItemsForMenu.map(item => {
        const options = menuItemOptions.filter(option => option.menu_item_id.toString() === item._id.toString());
        return {
          ...item.toObject(),
          options
        };
      });
      return {
        ...menu.toObject(),
        items: menuItemsWithOptions
      };
    });

    return {
      ...restaurant.toObject(),
      menus: organizedMenus,
      reviews
    };
  }

  async findAllWithDetails() {
    const restaurants = await this.restaurantModel.find({ isDeleted: { $ne: true } });

    const result = await Promise.all(restaurants.map(async (restaurant) => {
      const id = restaurant._id.toString();

      // Get all menus for this restaurant
      const menus = await this.menuModel.find({ restaurant_id: id, isDeleted: { $ne: true } });

      // Get all menu items for these menus
      const menuItems = await this.menuItemModel.find({
        menu_id: { $in: menus.map(menu => menu._id) },
        isDeleted: { $ne: true }
      });

      // Get all menu item options for these menu items
      const menuItemOptions = await this.menuItemOptionModel.find({
        menu_item_id: { $in: menuItems.map(item => item._id) },
        isDeleted: { $ne: true }
      });

      // Get all reviews for this restaurant
      const reviews = await this.reviewModel.find({
        restaurant_id: id,
        isDeleted: { $ne: true }
      }).populate('user_id');

      // Organize the data
      const organizedMenus = menus.map(menu => {
        const menuItemsForMenu = menuItems.filter(item => item.menu_id.toString() === menu._id.toString());
        const menuItemsWithOptions = menuItemsForMenu.map(item => {
          const options = menuItemOptions.filter(option => option.menu_item_id.toString() === item._id.toString());
          return {
            ...item.toObject(),
            options
          };
        });
        return {
          ...menu.toObject(),
          items: menuItemsWithOptions
        };
      });

      return {
        ...restaurant.toObject(),
        menus: organizedMenus,
        reviews
      };
    }));

    return result;
  }
}
