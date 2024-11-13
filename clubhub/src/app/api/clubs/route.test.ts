/**
 * @jest-environment node
 */

import { GET } from "./route";

it("should return data with status 200", async () => {
  const response = await GET();
  const body = await response.json();
  console.log("response", body);
  expect(response.status).toBe(200);
});


it("should return 500 when no items are retrieved", async () => {
    const response = await GET();
const body = await response.json();

if (body.error) {

    expect(response.status).toBe(500);

}


  });