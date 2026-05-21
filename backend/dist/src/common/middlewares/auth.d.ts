import { NextRequest } from 'next/server';
export declare function getSession(req: NextRequest): Promise<any>;
export declare function withAuth(req: NextRequest, handler: (req: NextRequest, user: any) => Promise<any>): Promise<any>;
