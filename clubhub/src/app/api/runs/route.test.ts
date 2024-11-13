/**
 * @jest-environment node
 */

import { v4 } from "uuid";
import {  GET, POST } from "./route";

it("should return data with status 200", async () => {
    const request = new Request("https://localhost:3000/api/runs");
  const response = await GET(request);
  const body = await response.json();
  console.log("response", body);
  expect(response.status).toBe(200);
});
