"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const DEFAULT_CORS_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
];
exports.default = (0, config_1.registerAs)('app', () => ({
    port: parseInt(process.env.PORT, 10) || 4000,
    env: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    corsOrigins: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
        : DEFAULT_CORS_ORIGINS,
}));
//# sourceMappingURL=app.config.js.map