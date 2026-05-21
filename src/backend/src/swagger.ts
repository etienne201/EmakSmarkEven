import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Event AI OS — API Documentation",
      version: "1.0.0",
      description: `
API complète de la plateforme **Smart Event AI OS**.
Gestion multi-tenant d'événements : Super Admin, Admin (organisateur), Invité.

### Rôles & Permissions
- **Super Admin** : Gestion plateforme, création comptes Admin, blocage instances, logs système.
- **Admin (Organisateur)** : Configuration événement, gestion invités/tables, statistiques locales.
- **Invité** : Scan QR Code, confirmation présence, consultation informations et placement.

> Authentifiez-vous via **Authorize** pour tester les routes protégées.`,
    },
    servers: [
      { url: "/v1", description: "Production" },
      { url: "/", description: "Local" }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            timestamp: { type: "string", format: "date-time" },
            code: { type: "string", example: "SUCCESS" },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            timestamp: { type: "string", format: "date-time" },
            code: { type: "string", example: "ERROR_CODE" },
            message: { type: "string", example: "Detailed error message" },
            data: { type: "object", nullable: true, example: null }
          }
        }
      }
    },
  },
  apis: ["./src/app/api/**/*.ts", "./src/backend/src/validations/*.ts"], // Scan all API routes and validations
};

export const getApiDocs = async () => {
  const spec = swaggerJsdoc(options);
  return spec;
};

