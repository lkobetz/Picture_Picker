import * as React from "react";
import renderer from "react-test-renderer";

import { MonoText } from "../StyledText";
import { callApi } from "../../api/call";
import * as axios from "axios";

it(`renders correctly`, () => {
  const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();

  expect(tree).toMatchSnapshot();
});

describe("callApi", () => {
  it("successfully fetches data from an API", async () => {
    const result = await callApi("cats", 1, 3);
    expect(result.hits.length).toEqual(3);
  });
});
