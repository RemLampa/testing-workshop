import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
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

    it("should execute a GET request when form is submitted", async () => {
      const { getByLabelText, getByText } = render(<SearchForm />);

      const inputField = getByLabelText(/keywords/i);
      const query = faker.random.word();
      fireEvent.change(inputField, {
        target: {
          value: query
        }
      });

      await wait();

      const sortDropdown = getByLabelText(/sort/i);
      const selectedSort = "forks";
      fireEvent.change(sortDropdown, {
        target: {
          value: selectedSort
        }
      });

      await wait();

      const orderDropdown = getByLabelText(/order/i);
      const selectedOrder = "asc";
      fireEvent.change(orderDropdown, {
        target: {
          value: selectedOrder
        }
      });

      await wait();

      const searchButton = getByText(/^search$/i);
      fireEvent.click(searchButton);

      expect(searchButton.textContent).toBe("Fetching Repos...");

      await wait();

      expect(searchButton.textContent).toBe("Search");

      expect(axios.get).toHaveBeenCalledTimes(1);

      const expectedFetchArgument = `https://api.github.com/search/repositories?q=${query}&sort=${selectedSort}&order=${selectedOrder}`;
      expect(axios.get).toHaveBeenCalledWith(expectedFetchArgument);
    });
  });
});
