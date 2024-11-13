/**
 * @jest-environment node
 */


import {GET} from "./route"
import { matchers } from 'jest-json-schema';
expect.extend(matchers);

it("should return data with status 200", async () => {
    const response = await GET();
    const body = await response.json()
    expect(response.status).toBe(200);
})


it('should return error with status 400 no items found', async () => {
  
  
    const response = await GET();
    const body = await response.json();
  
    expect(response.status).toBe(404);
    expect(body.error).toEqual(expect.any(String));
  });
  