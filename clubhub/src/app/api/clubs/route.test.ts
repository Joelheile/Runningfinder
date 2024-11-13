/**
 * @jest-environment node
 */

import { v4 } from "uuid";
import { DELETE, GET, POST } from "./route";
describe("API Club Routes", () => {
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
  const clubId = v4();
  it("should return added data with status 200", async () => {
   
    const requestObj = {
      json: async () => ({ id: clubId, name: "TestClub3" , location: { lng: 0, lat: 0 }, description: 'Description', instagramUsername: "instagram", websiteUrl: "website",  }),
    } as any;
  
    const response = await POST(requestObj);

  
    expect(response.status).toBe(200);
  });
  
  it("should delete club after adding with status 200", async()=>{
    const reponse = await DELETE({json: async () => ({ id: clubId })} as any);
    expect(reponse.status).toBe(200);
    console.log("club deleted", 
    )});})