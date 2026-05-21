export declare class AnalyticsController {
    getSummary(id: string): Promise<{
        views: number;
        checkins: number;
    }>;
    getViews(id: string): Promise<any[]>;
    getCheckins(id: string): Promise<any[]>;
    getEngagement(id: string): Promise<any[]>;
    getGuests(id: string): Promise<any[]>;
}
