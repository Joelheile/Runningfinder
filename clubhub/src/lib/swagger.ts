import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Running Finder API Documentation",
        version: "1.0",
      },
      components: {
       
      },
      security: [],
    },
  });
  return spec;
};