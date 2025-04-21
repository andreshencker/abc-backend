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
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Controller('rentals')
export class RentalController {
    constructor(private readonly rentalService: RentalService) {}

    @Post()
    async create(@Body() dto: CreateRentalDto) {
        try {
            const rental = await this.rentalService.create(dto);
            return { message: 'Rental created successfully', rental };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('bulk')
    async bulkCreate(@Body() dtoList: CreateRentalDto[]) {
        try {
            const rentals = await this.rentalService.bulkCreate(dtoList);
            return { message: 'Rentals created successfully', rentals };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    async findAll() {
        try {
            return await this.rentalService.findAll();
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.rentalService.findOne(id);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateRentalDto) {
        try {
            return await this.rentalService.update(id, dto);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            await this.rentalService.remove(id);
            return { message: 'Rental deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}