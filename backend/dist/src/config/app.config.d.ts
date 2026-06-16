declare const _default: (() => {
    port: number;
    env: string;
    jwtSecret: string;
    corsOrigins: string[];
}) & import("node_modules/@nestjs/config").ConfigFactoryKeyHost<{
    port: number;
    env: string;
    jwtSecret: string;
    corsOrigins: string[];
}>;
export default _default;
