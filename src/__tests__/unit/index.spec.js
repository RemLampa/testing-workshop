import React from "react";
import { shallow } from "enzyme";
import { Label, Input } from "@rebass/forms";
import faker from "faker";

import { QueryField } from "../../components/SearchForm";

faker.seed(824);

describe("UNIT TESTS", () => {
  describe("QueryField Component", () => {
    const props = {
      field: {
        fieldProp: faker.random.words()
      },
      testProp: faker.random.words()
    };

    it("should render a proper label", () => {
      const wrapper = shallow(<QueryField {...props} />);

      const label = wrapper.find(Label);

      expect(label.exists()).toBeTruthy();
      expect(label).toHaveLength(1);
      expect(label.prop("htmlFor")).toBe("query");
      expect(label.text()).toBe("Keywords");
    });

    it("should render input field", () => {
      const wrapper = shallow(<QueryField {...props} />);

      const input = wrapper.find(Input);

      expect(input.exists()).toBeTruthy();
      expect(input).toHaveLength(1);
      expect(input.prop("fieldProp")).toEqual(props.field.fieldProp);
    });
  });
});
