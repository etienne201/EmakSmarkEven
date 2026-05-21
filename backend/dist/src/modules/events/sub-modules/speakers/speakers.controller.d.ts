export declare class SpeakersController {
    findAll(id: string): Promise<any[]>;
    create(id: string, dto: any): Promise<{
        success: boolean;
    }>;
    update(id: string, dto: any): Promise<{
        success: boolean;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
