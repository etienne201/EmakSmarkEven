export declare class CreateTemplateDto {
    name: string;
    category: string;
    previewUrl: string;
    config: any;
    isPremium?: boolean;
}
export declare class CreateWebhookDto {
    url: string;
    events: string[];
    isActive?: boolean;
}
export declare class CreateApiKeyDto {
    name: string;
}
