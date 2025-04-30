import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Running Finder API Documentation",
        version: "1.0.0",
        description:
          "API documentation for Running Finder - a platform for discovering and joining running clubs and events nearby.",
        contact: {
          name: "Running Finder",
          url: "https://runningfinder.com",
        },
      },
      components: {
        schemas: {
          Run: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              clubId: { type: "string", format: "uuid" },
              datetime: { type: "string", format: "date-time" },
              weekday: { type: "integer", minimum: 1, maximum: 7 },
              distance: { type: "number", format: "float" },
              difficulty: {
                type: "string",
                enum: ["easy", "intermediate", "advanced"],
              },
              startDescription: { type: "string" },
              locationLat: { type: "number", format: "float" },
              locationLng: { type: "number", format: "float" },
              mapsLink: { type: "string", nullable: true },
              isRecurrent: { type: "boolean", default: false },
              isApproved: { type: "boolean", default: false },
            },
          },
          Club: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              slug: { type: "string" },
              description: { type: "string" },
              avatarUrl: { type: "string", nullable: true },
              creationDate: { type: "string", format: "date-time" },
              instagramUsername: { type: "string", nullable: true },
              stravaUsername: { type: "string", nullable: true },
              websiteUrl: { type: "string", nullable: true },
              isApproved: { type: "boolean", default: false },
            },
          },
          Membership: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              userId: { type: "string", format: "uuid" },
              clubId: { type: "string", format: "uuid" },
              joinDate: { type: "string", format: "date-time" },
              status: {
                type: "string",
                enum: ["pending", "active", "rejected"],
              },
              role: { type: "string", enum: ["member", "admin", "owner"] },
            },
          },
          Registration: {
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              userId: { type: "string", format: "uuid" },
              runId: { type: "string", format: "uuid" },
              status: {
                type: "string",
                enum: ["registered", "attended", "cancelled"],
              },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
      tags: [
        {
          name: "runs",
        },
        {
          name: "clubs",
        },
        {
          name: "admin",
        },
        {
          name: "memberships",
        },
        {
          name: "registrations",
        },
        {
          name: "upload",
        },
        {
          name: "ai",
        },
      ],
    },
  });

  return spec;
};
