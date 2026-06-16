import { registerAs } from '@nestjs/config';

const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000', // admin-web
  'http://localhost:3002', // super-admin
  'http://localhost:3003', // scanner-app
  'http://localhost:3004', // public-event
  'http://localhost:3005', // guest-app
];

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : DEFAULT_CORS_ORIGINS,
}));
