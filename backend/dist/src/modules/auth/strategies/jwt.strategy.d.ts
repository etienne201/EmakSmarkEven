import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../database/prisma.service';
import { AuthUser } from '../auth.types';
declare const JwtStrategy_base: new (...args: [opt: import("node_modules/@types/passport-jwt").StrategyOptionsWithRequest] | [opt: import("node_modules/@types/passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: string;
    }): Promise<AuthUser>;
}
export {};
