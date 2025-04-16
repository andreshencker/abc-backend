import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @Get('summary')
    async getSummary() {
        try {
            const data = await this.dashboardService.getSummary();
            return { message: 'Dashboard summary retrieved successfully', data };
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to retrieve dashboard summary',
                error.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}