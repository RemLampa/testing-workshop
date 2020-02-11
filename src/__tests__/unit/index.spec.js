import React from "react";
import { shallow } from "enzyme";
import { Label, Input, Select } from "@rebass/forms";
import faker from "faker";
import { Formik, Form, Field } from "formik";

import SearchForm, {
  QueryField,
  SortSelect,
  OrderSelect
} from "../../components/SearchForm";

faker.seed(824);

describe("UNIT TESTS", () => {
  describe("QueryField Component", () => {
    const props = {
      field: {
        fieldProp: faker.random.words()
      },
      testProp: faker.random.words()
    };

    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<QueryField {...props} />);
    });

    afterEach(() => {
      wrapper = null;
    });

    it("should render a proper label", () => {
      const label = wrapper.find(Label);

      expect(label.exists()).toBeTruthy();
      expect(label).toHaveLength(1);
      expect(label.prop("htmlFor")).toBe("query");
      expect(label.text()).toBe("Keywords");
    });

    it("should render input field", () => {
      const input = wrapper.find(Input);

      expect(input.exists()).toBeTruthy();
      expect(input).toHaveLength(1);
      expect(input.prop("fieldProp")).toEqual(props.field.fieldProp);
    });
  });

  describe("SortSelect Component", () => {
    const props = {
      field: {
        fieldProp: faker.random.words()
      },
      testProp: faker.random.words()
    };

    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<SortSelect {...props} />);
    });

    afterEach(() => {
      wrapper = null;
    });

    it("should render a proper label", () => {
      const label = wrapper.find(Label);

      expect(label.exists()).toBeTruthy();
      expect(label).toHaveLength(1);
      expect(label.prop("htmlFor")).toBe("sort");
      expect(label.text()).toBe("Sort");
    });

    it("should render a select field", () => {
      const select = wrapper.find(Select);

      expect(select.exists()).toBeTruthy();
      expect(select).toHaveLength(1);
      expect(select.prop("fieldProp")).toBe(props.field.fieldProp);
      expect(select.prop("testProp")).toBe(props.testProp);
    });

    it("should render select options", () => {
      const options = wrapper.find(Select).find("option");

      expect(options.exists()).toBeTruthy();
      expect(options).toHaveLength(5);

      expect(options.at(0).text()).toBe("Best Match");
      expect(options.at(0).prop("value")).toBe("");

      expect(options.at(1).text()).toBe("Stars");
      expect(options.at(1).prop("value")).toBe("stars");

      expect(options.at(2).text()).toBe("Forks");
      expect(options.at(2).prop("value")).toBe("forks");

      expect(options.at(3).text()).toBe("Help Wanted Issues");
      expect(options.at(3).prop("value")).toBe("help-wanted-issues");

      expect(options.at(4).text()).toBe("Updated");
      expect(options.at(4).prop("value")).toBe("updated");
    });
  });

  describe("OrderSelect Component", () => {
    const props = {
      field: {
        fieldProp: faker.random.words()
      },
      testProp: faker.random.words()
    };

    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<OrderSelect {...props} />);
    });

    afterEach(() => {
      wrapper = null;
    });

    it("should render a proper label", () => {
      const label = wrapper.find(Label);

      expect(label.exists()).toBeTruthy();
      expect(label).toHaveLength(1);
      expect(label.prop("htmlFor")).toBe("order");
      expect(label.text()).toBe("Order");
    });

    it("should render a select field", () => {
      const select = wrapper.find(Select);

      expect(select.exists()).toBeTruthy();
      expect(select).toHaveLength(1);
      expect(select.prop("fieldProp")).toBe(props.field.fieldProp);
      expect(select.prop("testProp")).toBe(props.testProp);
    });

    it("should render select options", () => {
      const options = wrapper.find(Select).find("option");

      expect(options.exists()).toBeTruthy();
      expect(options).toHaveLength(2);

      expect(options.at(0).text()).toBe("Desc");
      expect(options.at(0).prop("value")).toBe("desc");

      expect(options.at(1).text()).toBe("Asc");
      expect(options.at(1).prop("value")).toBe("asc");
    });
  });

  describe("SearchForm Component", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<SearchForm />);
    });

    afterEach(() => {
      wrapper = null;
    });

    it("should render a Formik component instance", () => {
      const formikWrapper = wrapper.find(Formik);

      expect(formikWrapper.exists()).toBeTruthy();
      expect(formikWrapper.length).toBe(1);

      const expectedInitialValues = {
        query: "",
        sort: "",
        order: "desc"
      };

      expect(formikWrapper.prop("initialValues")).toStrictEqual(
        expectedInitialValues
      );

      expect(formikWrapper.prop("onSubmit")).toStrictEqual(
        expect.any(Function)
      );
    });
  });
});
