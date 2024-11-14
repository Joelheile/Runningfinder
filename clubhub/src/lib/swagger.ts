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
      tags:[
        {
          name: "clubs",
          description: "Club operations"
        },
        {
          name: "runs",
          description: "Run operations"
        }
      ],
      components: {
       
      },
      security: [],
    },
  });
  return spec;
};