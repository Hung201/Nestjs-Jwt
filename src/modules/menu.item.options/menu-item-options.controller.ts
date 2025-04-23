import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MenuItemOptionsService } from './menu-item-options.service';
import { CreateMenuItemOptionDto } from './dto/create-menu-item-option.dto';
import { UpdateMenuItemOptionDto } from './dto/update-menu-item-option.dto';

@Controller('menu-item-options')
export class MenuItemOptionsController {
    constructor(private readonly menuItemOptionsService: MenuItemOptionsService) { }

    @Post()
    create(@Body() createMenuItemOptionDto: CreateMenuItemOptionDto) {
        return this.menuItemOptionsService.create(createMenuItemOptionDto);
    }

    @Get()
    findAll(
        @Query() query: string,
        @Query('current') current: string,
        @Query('pageSize') pageSize: string,
    ) {
        return this.menuItemOptionsService.findAll(query, +current, +pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.menuItemOptionsService.findOne(id);
    }

    @Patch()
    update(@Body() updateMenuItemOptionDto: UpdateMenuItemOptionDto) {
        return this.menuItemOptionsService.update(updateMenuItemOptionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.menuItemOptionsService.remove(id);
    }
} 