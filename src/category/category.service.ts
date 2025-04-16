import {
    Injectable,
    NotFoundException,
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private readonly categoryModel: Model<CategoryDocument>,
    ) {}

    async create(dto: CreateCategoryDto): Promise<Category> {
        try {
            const exists = await this.categoryModel.findOne({ catName: dto.catName });
            if (exists) throw new ConflictException('Category already exists');

            const category = new this.categoryModel(dto);
            return await category.save();
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to create category');
        }
    }

    async findAll(): Promise<Category[]> {
        try {
            return await this.categoryModel.find();
        } catch {
            throw new InternalServerErrorException('Failed to fetch categories');
        }
    }

    async findOne(id: string): Promise<Category> {
        try {
            const category = await this.categoryModel.findById(id);
            if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
            return category;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to fetch category');
        }
    }

    async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        try {
            const updated = await this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
            if (!updated) throw new NotFoundException(`Category with ID ${id} not found`);
            return updated;
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to update category');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.categoryModel.findByIdAndDelete(id);
            if (!result) throw new NotFoundException(`Category with ID ${id} not found`);
        } catch (error) {
            if (error.status) throw error;
            throw new InternalServerErrorException('Failed to delete category');
        }
    }
}