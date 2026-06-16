export declare class CreateContentDto {
    title: string;
    type: string;
    data: any;
    order?: number;
}
declare const UpdateContentDto_base: import("node_modules/@nestjs/common").Type<Partial<CreateContentDto>>;
export declare class UpdateContentDto extends UpdateContentDto_base {
}
export {};
