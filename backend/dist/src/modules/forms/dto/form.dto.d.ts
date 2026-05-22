export declare class CreateFormDto {
    title: string;
    description?: string;
    isActive?: boolean;
    fields: any[];
}
declare const UpdateFormDto_base: import("@nestjs/common").Type<Partial<CreateFormDto>>;
export declare class UpdateFormDto extends UpdateFormDto_base {
}
export declare class FormResponseDto {
    answers: any;
}
export {};
