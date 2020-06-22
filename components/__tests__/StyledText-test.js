import * as React from "react";
import renderer from "react-test-renderer";
import store from "../../store/index";

import { MonoText } from "../StyledText";
import { callApi } from "../../api/call";
import AllImages from "../AllImages";
import { JSDOM } from "jsdom";
import { configure, mount, render, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import "react-native-mock-render/mock";

configure({ adapter: new Adapter() });

const { window } = new JSDOM();

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: "node.js",
};
copyProps(window, global);

it(`renders correctly`, () => {
  const tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();

  expect(tree).toMatchSnapshot();
});

describe("callApi", () => {
  it("returns all results in an array", async () => {
    const result = await callApi("cats", 50, 10);
    expect(result.hits.length).toEqual(10);
  });
});

describe("loadMore", () => {
  it("is a function", () => {
    expect(typeof AllImages.WrappedComponent.prototype.loadMore).toBe(
      "function"
    );
  });
});

describe("FlatList", () => {
  const wrapper = mount(<AllImages store={store} />);
  const FlatList = wrapper.find("FlatList");
  const key = FlatList.props().keyExtractor({ id: 3 });
  it("returns the correct key", () => {
    expect(key).toEqual("3");
  });
  it("calls onEndReached when scrolled to end", () => {
    // ???
  });
});
