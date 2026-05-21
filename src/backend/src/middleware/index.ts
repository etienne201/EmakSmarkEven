/**
 * @backend/middleware - Barrel Export
 * Single point of access for all API middleware.
 */
export { AuthGuard, authorize, type Role } from './auth-guard';
export { handleApiError, AppError } from './error-handler';
export { createSuccessResponse } from './response-handler';
