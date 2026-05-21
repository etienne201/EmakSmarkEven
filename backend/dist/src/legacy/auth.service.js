"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../lib/prisma");
const errors_1 = require("../lib/errors");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthService {
    static async login(email, passwordHash) {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            include: { role: true, organization: true }
        });
        if (!user) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        const isMatch = passwordHash === user.passwordHash;
        if (!isMatch) {
            throw new errors_1.UnauthorizedError('Invalid email or password');
        }
        if (user.status !== 'active') {
            throw new errors_1.UnauthorizedError('User account is not active');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '1d' });
        await prisma_1.default.userSession.create({
            data: {
                userId: user.id,
                refreshToken: token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            }
        });
        return { user, token };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map