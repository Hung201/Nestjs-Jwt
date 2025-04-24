import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { Restaurant, RestaurantSchema } from './schemas/restaurant.schema';
import { Menu, MenuSchema } from '../menus/schemas/menu.schema';
import { MenuItem, MenuItemSchema } from '../menu.items/schemas/menu.item.schema';
import { MenuItemOption, MenuItemOptionSchema } from '../menu.item.options/schemas/menu.item.option.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Menu.name, schema: MenuSchema },
      { name: MenuItem.name, schema: MenuItemSchema },
      { name: MenuItemOption.name, schema: MenuItemOptionSchema },
      { name: Review.name, schema: ReviewSchema }
    ])
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService]
})
export class RestaurantsModule { }
