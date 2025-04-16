import * as Joi from 'joi';

export const validationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production').default('development'),
    MONGO_URI: Joi.string().uri().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('1d'),
    APP_URL: Joi.string().uri().required(),
    CORS_ORIGIN: Joi.string().required(),
});