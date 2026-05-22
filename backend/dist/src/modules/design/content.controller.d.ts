import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
export declare class ContentController {
    findAll(id: string): Promise<any[]>;
    create(id: string, dto: CreateContentDto): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: UpdateContentDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
