import { v4 } from "uuid";
import { GET, POST } from "./route";

let clubId: string;
let runId: string;

describe("API Run Routes", () => {
  it("should return data with status 200", async () => {
    const request = new Request("https://localhost:3000/api/runs");
    const response = await GET(request);
    const body = await response.json();
    console.log("response", body);
    expect(response.status).toBe(200);

    clubId = body[0].clubId; 
    console.log("clubId", clubId);
  });

  it("should return added data with status 200", async () => {
    const requestObj = {
      json: async () => ({
        id: v4(),
        clubId: clubId,
        name: "testrun",
        distance: 5,
        time: "01:01",
        difficulty: "easy",
        location: { lng: 0, lat: 0 },
      }),
    } as any;

    const response = await POST(requestObj);
console.log("testing response", response);
    expect(response.status).toBe(201);
  });
});