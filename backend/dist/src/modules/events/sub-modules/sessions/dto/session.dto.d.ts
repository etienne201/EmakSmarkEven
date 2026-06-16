export declare class CreateSessionDto {
    title: string;
    description?: string;
    venue?: string;
    startAt: string;
    endAt: string;
    capacity?: number;
}
declare const UpdateSessionDto_base: import("node_modules/@nestjs/common").Type<Partial<CreateSessionDto>>;
export declare class UpdateSessionDto extends UpdateSessionDto_base {
}
export {};
