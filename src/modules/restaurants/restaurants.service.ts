import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import aqp from 'api-query-params';
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

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = new this.restaurantModel(createRestaurantDto);
    const savedRestaurant = await restaurant.save();
    return {
      ...savedRestaurant.toObject(),
      createdAt: savedRestaurant.createdAt
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    const offset = (+current - 1) * +pageSize;
    const defaultLimit = +pageSize ? +pageSize : 10;

    const totalItems = (await this.restaurantModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.restaurantModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any);

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
    return await this.restaurantModel.findById(id);
  }

  async update(updateRestaurantDto: UpdateRestaurantDto) {
    return await this.restaurantModel.updateOne(
      { _id: updateRestaurantDto._id },
      { ...updateRestaurantDto }
    );
  }

  async remove(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndDelete(id);
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
