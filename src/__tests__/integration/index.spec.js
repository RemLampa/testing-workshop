import React from "react";
import { render } from "@testing-library/react";
import faker from "faker";
import axios from "axios";

import SearchForm from "../../components/SearchForm";

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

describe("INTEGRATION TESTS", () => {
  describe("SearchForm Component", () => {
    it("should have a header title", () => {
      const { getByText } = render(<SearchForm />);

      const headerElement = getByText(/github/i);
      expect(headerElement).toBeTruthy();

      const expectedText = "GitHub Respositories Search";
      expect(headerElement.textContent).toBe(expectedText);
    });

    it("should render a search form", () => {
      const { getByLabelText, getByText } = render(<SearchForm />);

      const inputField = getByLabelText(/keywords/i);
      expect(inputField).toBeTruthy();

      const sortDropdown = getByLabelText(/sort/i);
      expect(sortDropdown).toBeTruthy();

      const orderDropdown = getByLabelText(/order/i);
      expect(orderDropdown).toBeTruthy();

      const searchButton = getByText(/^search$/i);
      expect(searchButton).toBeTruthy();
      expect(searchButton.textContent).toBe("Search");
    });
  });
});
