export declare class VenuesController {
    findAll(): Promise<any[]>;
    create(dto: any): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
