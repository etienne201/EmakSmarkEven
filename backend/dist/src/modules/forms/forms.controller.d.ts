export declare class FormsController {
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
    respond(id: string, answers: any): Promise<{
        success: boolean;
    }>;
    getResponses(id: string): Promise<any[]>;
}
