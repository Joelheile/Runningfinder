import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

export { app };
export default handle(app);
