export declare class QRController {
    generate(body: {
        data: string;
    }): Promise<{
        qrUrl: string;
    }>;
    scan(body: {
        code: string;
    }): Promise<{
        success: boolean;
    }>;
}
