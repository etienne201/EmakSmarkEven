"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = getSession;
exports.withAuth = withAuth;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../lib/errors");
async function getSession(req) {
    const authHeader = req.headers.get('authorization');
    let token;
    if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    else {
        token = req.cookies.get('token')?.value;
    }
    if (!token) {
        throw new errors_1.UnauthorizedError('Authentication token missing');
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            include: { role: true, organization: true }
        });
        if (!user) {
            throw new errors_1.UnauthorizedError('User not found');
        }
        if (user.status !== 'active') {
            throw new errors_1.UnauthorizedError('User account is not active');
        }
        return user;
    }
    catch (error) {
        throw new errors_1.UnauthorizedError('Invalid or expired token');
    }
}
async function withAuth(req, handler) {
    const user = await getSession(req);
    return handler(req, user);
}
//# sourceMappingURL=auth.js.map