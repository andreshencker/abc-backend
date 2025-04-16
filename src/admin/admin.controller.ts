import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    HttpException,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('users')
    async findAllStaff() {
        try {
            const staff = await this.adminService.findAllStaff();
            return { message: 'Staff list retrieved successfully', staff };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('roles/:id')
    async updateRole(@Param('id') id: string, @Body() body: { role: string }) {
        try {
            const updated = await this.adminService.updateRole(id, body.role);
            return { message: 'User role updated successfully', user: updated };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('status/:id')
    async toggleActive(@Param('id') id: string) {
        try {
            const user = await this.adminService.toggleActive(id);
            return {
                message: `User is now ${user.isActive ? 'active' : 'inactive'}`,
                user,
            };
        } catch (error) {
            throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}