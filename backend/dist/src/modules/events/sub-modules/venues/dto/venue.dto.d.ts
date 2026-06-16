export declare class CreateVenueDto {
    name: string;
    address?: string;
    capacity?: number;
    mapUrl?: string;
}
declare const UpdateVenueDto_base: import("node_modules/@nestjs/common").Type<Partial<CreateVenueDto>>;
export declare class UpdateVenueDto extends UpdateVenueDto_base {
}
export {};
