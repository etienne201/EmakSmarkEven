export declare class CreateSponsorDto {
    name: string;
    tier?: string;
    website?: string;
    logoUrl?: string;
}
declare const UpdateSponsorDto_base: import("@nestjs/common").Type<Partial<CreateSponsorDto>>;
export declare class UpdateSponsorDto extends UpdateSponsorDto_base {
}
export {};
