import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller('properties')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}

    @Post()
    async create(@Body() dto: CreatePropertyDto) {
        try {
            const property = await this.propertyService.create(dto);
            return { message: 'Property created successfully', property };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('bulk')
    async createBulk(@Body() dto: CreatePropertyDto[]) {
        console.log('Bulk DTO:', dto); // ✅ Confirmar que llegan los datos
        try {
            const properties = await this.propertyService.bulkCreate(dto);
            console.log('Inserted:', properties); // ✅ Confirmar que se insertaron
            return { message: 'Properties created successfully', properties };
        } catch (error) {
            console.error('Error inserting bulk:', error);
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Get()
    async findAll() {
        try {
            return await this.propertyService.findAll();
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.propertyService.findOne(id);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdatePropertyDto) {
        try {
            return await this.propertyService.update(id, dto);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            await this.propertyService.remove(id);
            return { message: 'Property deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}