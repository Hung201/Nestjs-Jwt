import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Controller('menu-items')
export class MenuItemsController {
    constructor(private readonly menuItemsService: MenuItemsService) { }

    @Post()
    create(@Body() createMenuItemDto: CreateMenuItemDto) {
        return this.menuItemsService.create(createMenuItemDto);
    }

    @Get()
    findAll(
        @Query() query: string,
        @Query('current') current: string,
        @Query('pageSize') pageSize: string,
    ) {
        return this.menuItemsService.findAll(query, +current, +pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.menuItemsService.findOne(id);
    }

    @Patch()
    update(@Body() updateMenuItemDto: UpdateMenuItemDto) {
        return this.menuItemsService.update(updateMenuItemDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.menuItemsService.remove(id);
    }
} 