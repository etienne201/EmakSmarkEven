import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
export declare class TablesController {
    findAll(id: string): Promise<any[]>;
    create(id: string, dto: CreateTableDto): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: UpdateTableDto): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
