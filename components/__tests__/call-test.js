import { callApi } from "../../api/call";

describe("callApi", () => {
  it("returns all results in an array", async () => {
    const result = await callApi("cats", 50, 10);
    expect(result.hits.length).toEqual(10);
  });
});
