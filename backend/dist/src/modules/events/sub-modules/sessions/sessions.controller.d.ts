import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
export declare class SessionsController {
    findAll(id: string): Promise<any[]>;
    create(id: string, dto: CreateSessionDto): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: UpdateSessionDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
