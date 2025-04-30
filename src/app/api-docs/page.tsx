import { getApiDocs } from "@/lib/swagger";

export default function ApiDocs() {
  // This will be a simple page that loads the Swagger UI via a script
  const spec = JSON.stringify(getApiDocs());

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        Running Finder API Documentation
      </h1>

      <div id="swagger-ui"></div>

      {/* Load Swagger UI assets */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css"
      />

      <script
        src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"
        defer
      ></script>

      <script
        id="swagger-initializer"
        defer
        dangerouslySetInnerHTML={{
          __html: `
            window.onload = function() {
              const ui = SwaggerUIBundle({
                spec: ${spec},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                ],
                layout: "BaseLayout",
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                validatorUrl: null
              });
              window.ui = ui;
            };
          `,
        }}
      />
    </div>
  );
}
