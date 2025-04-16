import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
    ValidationPipe as BaseValidationPipe,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe extends BaseValidationPipe {
    constructor() {
        super({
            whitelist: true, // Remove properties that don't exist in DTO
            forbidNonWhitelisted: true, // Throw error on extra properties
            transform: true, // Automatically transform payloads to DTO classes
            transformOptions: {
                enableImplicitConversion: true,
            },
        });
    }

    async transform(value: any, metadata: ArgumentMetadata) {
        try {
            return await super.transform(value, metadata);
        } catch (error) {
            if (error instanceof BadRequestException) {
                const response = error.getResponse() as any;
                throw new BadRequestException({
                    message: 'Validation failed',
                    errors: response.message || [],
                });
            }
            throw error;
        }
    }
}