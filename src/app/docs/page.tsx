import ReactSwagger from "@/components/Documentation/Swagger";
import { getApiDocs } from "@/lib/utils/swagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <div className="pt-6">
      <section className="container">
        <ReactSwagger spec={spec} url="/swagger.json" />
      </section>
    </div>
  );
}
