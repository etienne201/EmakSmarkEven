export declare class AssetsController {
    upload(): Promise<{
        url: string;
    }>;
    findOne(id: string): Promise<{
        id: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    getGallery(id: string): Promise<any[]>;
    addToGallery(id: string): Promise<{
        success: boolean;
    }>;
    removeFromGallery(id: string, assetId: string): Promise<{
        success: boolean;
    }>;
}
