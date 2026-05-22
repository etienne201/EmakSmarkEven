export declare class AppController {
    root(): {
        service: string;
        status: string;
        version: string;
        baseUrl: string;
        docs: string;
    };
    health(): {
        status: string;
        timestamp: string;
        service: string;
    };
}
