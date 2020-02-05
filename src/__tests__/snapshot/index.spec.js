import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

import SearchForm from "../../components/SearchForm";

describe("SNAPSHOT TESTS", () => {
  describe("SearchForm Component", () => {
    it("should render properly", () => {
      const element = shallow(<SearchForm />);

      expect(toJson(element)).toMatchSnapshot();
    });
  });
});
