export interface CityHall {
    name: string;
    address: string;
    contact: string;
    hours: string;
    image: string;
    details: string;
}
export interface GeoStructure {
    [country: string]: {
        [region: string]: {
            [commune: string]: CityHall[];
        };
    };
}
export declare const GEO_DATA: GeoStructure;
