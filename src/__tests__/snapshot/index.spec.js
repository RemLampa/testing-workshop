import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";

import SearchForm, { QueryField } from "../../components/SearchForm";

describe("SNAPSHOT TESTS", () => {
  describe("SearchForm Component", () => {
    it("should render properly", () => {
      const element = shallow(<SearchForm />);

      expect(toJson(element)).toMatchSnapshot();
    });
  });

  describe("QueryField Component", () => {
    it("should render properly", () => {
      const field = {
        id: "some-id",
        name: "some-name"
      };

      const props = {
        required: true,
        onSubmit: () => {}
      };

      const element = shallow(<QueryField field={field} {...props} />);

      expect(toJson(element)).toMatchSnapshot();
    });
  });
});
