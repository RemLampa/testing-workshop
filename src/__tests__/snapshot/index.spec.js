import React from "react";
import { act } from "react-dom/test-utils";
import { shallow, mount } from "enzyme";
import toJson from "enzyme-to-json";

import axios from "axios";
import faker from "faker";

import SearchForm, {
  QueryField,
  SortSelect,
  OrderSelect
} from "../../components/SearchForm";

faker.seed(824);

const items = [
  {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    owner: {
      avatar_url: faker.image.avatar()
    },
    stargazers_count: faker.random.number(10000),
    forks_count: faker.random.number(10000),
    open_issues_count: faker.random.number(1000),
    updated_at: faker.date.between("2019-01-01", "2019-12-31").toString()
  },
  {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    owner: {
      avatar_url: faker.image.avatar()
    },
    stargazers_count: faker.random.number(10000),
    forks_count: faker.random.number(10000),
    open_issues_count: faker.random.number(1000),
    updated_at: faker.date.between("2019-01-01", "2019-12-31").toString()
  },
  {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    owner: {
      avatar_url: faker.image.avatar()
    },
    stargazers_count: faker.random.number(10000),
    forks_count: faker.random.number(10000),
    open_issues_count: faker.random.number(1000),
    updated_at: faker.date.between("2019-01-01", "2019-12-31").toString()
  }
];

axios.get.mockResolvedValue({
  data: { items }
});

describe("SNAPSHOT TESTS", () => {
  describe("SearchForm Component", () => {
    it("should render properly", () => {
      const element = shallow(<SearchForm />);

      expect(toJson(element)).toMatchSnapshot();
    });

    it("should render repositories upon form submission", async () => {
      const wrapper = mount(<SearchForm />);

      const testQuery = faker.random.word();
      wrapper
        .find(QueryField)
        .find("input")
        .simulate("change", {
          target: {
            name: "query",
            value: testQuery
          }
        });

      const testSort = "forks";
      wrapper
        .find(SortSelect)
        .find("select")
        .simulate("change", {
          target: {
            name: "sort",
            value: testSort
          }
        });

      const testOrder = "asc";
      wrapper
        .find(OrderSelect)
        .find("select")
        .simulate("change", {
          target: {
            name: "order",
            value: testOrder
          }
        });

      wrapper.update();
      expect(wrapper.find(OrderSelect));

      await act(async () => {
        wrapper.find("form").simulate("submit");
      });

      wrapper.update();
      expect(toJson(wrapper)).toMatchSnapshot();
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

  describe("SortSelect Component", () => {
    it("should render properly", () => {
      const field = {
        id: "some-id",
        name: "some-name"
      };

      const props = {
        required: true,
        onSubmit: () => {}
      };

      const element = shallow(<SortSelect field={field} {...props} />);

      expect(toJson(element)).toMatchSnapshot();
    });
  });

  describe("OrderSelect Component", () => {
    it("should render properly", () => {
      const field = {
        id: "some-id",
        name: "some-name"
      };

      const props = {
        required: true,
        onSubmit: () => {}
      };

      const element = shallow(<OrderSelect field={field} {...props} />);

      expect(toJson(element)).toMatchSnapshot();
    });
  });
});
