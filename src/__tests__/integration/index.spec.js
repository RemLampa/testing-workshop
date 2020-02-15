import React from "react";
import { render, fireEvent, wait, act } from "@testing-library/react";
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
    updated_at: faker.date.between("2019-01-01", "2019-12-31").toString(),
    html_url: faker.internet.url()
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
    updated_at: faker.date.between("2019-01-01", "2019-12-31").toString(),
    html_url: faker.internet.url()
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
    updated_at: faker.date.between("2019-01-01", "2019-12-31").toString(),
    html_url: faker.internet.url()
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

    it("should render a list of repositories upon successful search request", async () => {
      const { getByLabelText, getByText, getByAltText, getAllByText } = render(
        <SearchForm />
      );

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

      items.forEach((repo, i) => {
        expect(() => getByAltText(repo.name)).toThrow();

        expect(() => getByText(repo.name)).toThrow();
      });

      const starsElement = getAllByText(/stars/i);
      expect(starsElement.length).toBe(1);

      const forksElement = getAllByText(/forks/i);
      expect(forksElement.length).toBe(1);

      const issuesElement = getAllByText(/issues/i);
      expect(issuesElement.length).toBe(1);

      const updateDateElement = getAllByText(/updated/i);
      expect(updateDateElement.length).toBe(1);

      await wait();

      items.forEach((repo, i) => {
        const avatarElement = getByAltText(repo.name);
        expect(avatarElement.src).toBe(repo.owner.avatar_url);

        const nameElement = getByText(repo.name);
        expect(nameElement).toBeTruthy();
        expect(nameElement.textContent).toBe(repo.name);

        // due to options text in sort dropdown
        const actualListIndex = i + 1;

        const starsElement = getAllByText(/stars/i);
        const starsText = `${repo.stargazers_count} stars`;
        expect(starsElement[actualListIndex].textContent).toBe(starsText);

        const forksElement = getAllByText(/forks/i);
        const forksText = `${repo.forks_count} forks`;
        expect(forksElement[actualListIndex].textContent).toBe(forksText);

        const issuesElement = getAllByText(/issues/i);
        const issuesText = `${repo.open_issues_count} open issues`;
        expect(issuesElement[actualListIndex].textContent).toBe(issuesText);

        const updateDateElement = getAllByText(/updated/i);
        const updateDateText = `updated last ${repo.updated_at}`;
        expect(updateDateElement[actualListIndex].textContent).toBe(
          updateDateText
        );
      });
    });

    describe("Repository List", () => {
      beforeEach(() => {
        global.window = Object.create(window);
        Object.defineProperty(window, "location", {
          value: {
            href: ""
          }
        });
      });

      it("should have elements that redirect to the repository links when clicked", async () => {
        const { getByLabelText, getByText, getByTestId } = render(
          <SearchForm />
        );

        const inputField = getByLabelText(/keywords/i);
        const query = faker.random.word();
        act(() => {
          fireEvent.change(inputField, {
            target: {
              value: query
            }
          });
        });

        const sortDropdown = getByLabelText(/sort/i);
        const selectedSort = "forks";
        act(() => {
          fireEvent.change(sortDropdown, {
            target: {
              value: selectedSort
            }
          });
        });

        const orderDropdown = getByLabelText(/order/i);
        const selectedOrder = "asc";
        act(() => {
          fireEvent.change(orderDropdown, {
            target: {
              value: selectedOrder
            }
          });
        });

        const searchButton = getByText(/^search$/i);
        await act(async () => {
          fireEvent.click(searchButton);
        });

        items.forEach(repo => {
          const repoCard = getByTestId(repo.id);

          expect(repoCard).toBeTruthy();

          act(() => {
            fireEvent.click(repoCard);
          });

          expect(window.location.href).toBe(repo.html_url);
        });
      });
    });
  });
});
