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
import { SaleService } from './sales.service';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';

@Controller('sales')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @Post()
    async create(@Body() dto: CreateSaleDto) {
        try {
            const sale = await this.saleService.create(dto);
            return { message: 'Sale created successfully', sale };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('bulk')
    async bulkCreate(@Body() dtoList: CreateSaleDto[]) {
        try {
            const sales = await this.saleService.bulkCreate(dtoList);
            return { message: 'Sales created successfully', sales };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    async findAll() {
        try {
            return await this.saleService.findAll();
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.saleService.findOne(id);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateSaleDto) {
        try {
            return await this.saleService.update(id, dto);
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            await this.saleService.remove(id);
            return { message: 'Sale deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}