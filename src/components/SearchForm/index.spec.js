import React from "react";
import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";
import axios from "axios";

import SearchForm from ".";

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

describe("SearchForm Component", () => {
  it("should have a header title", () => {
    const { getByText } = render(<SearchForm />);

    const headerElement = getByText(/github/i);
    expect(headerElement).toBeInTheDocument();

    const expectedText = "GitHub Respositories Search";
    expect(headerElement.textContent).toBe(expectedText);
  });

  it("should render a search form", () => {
    const { getByLabelText, getByText } = render(<SearchForm />);

    const inputField = getByLabelText(/keywords/i);
    expect(inputField).toBeInTheDocument();

    const sortDropdown = getByLabelText(/sort/i);
    expect(sortDropdown).toBeInTheDocument();

    const orderDropdown = getByLabelText(/order/i);
    expect(orderDropdown).toBeInTheDocument();

    const searchButton = getByText(/^search$/i);
    expect(searchButton).toBeInTheDocument();
    expect(searchButton.textContent).toBe("Search");
  });

  it("should execute a GET request when form is submitted", async () => {
    const { getByLabelText, getByText } = render(<SearchForm />);

    const inputField = getByLabelText(/keywords/i);
    const query = faker.random.word();
    userEvent.type(inputField, query);

    const sortDropdown = getByLabelText(/sort/i);
    const selectedSort = "forks";
    userEvent.selectOptions(sortDropdown, selectedSort); 

    const orderDropdown = getByLabelText(/order/i);
    const selectedOrder = "asc";
    userEvent.selectOptions(orderDropdown, selectedOrder);

    await waitFor(() => expect(getByText(/^search$/i).closest('button')).not.toHaveAttribute("disabled"));

    const searchButton = getByText(/^search$/i);
    userEvent.click(searchButton);

    await waitFor(() => expect(searchButton.textContent).toBe("Fetching Repos..."));

    expect(searchButton.textContent).toBe("Search");

    expect(axios.get).toHaveBeenCalledTimes(1);

    const expectedFetchArgument = `https://api.github.com/search/repositories?q=${query}&sort=${selectedSort}&order=${selectedOrder}`;
    expect(axios.get).toHaveBeenCalledWith(expectedFetchArgument);
  });

  it("should render a list of repositories upon successful search request", async () => {
    const { getByLabelText, getByText, getByAltText, getAllByText } = render(<SearchForm />);

    const inputField = getByLabelText(/keywords/i);
    const query = faker.random.word();
    userEvent.type(inputField, query);

    const sortDropdown = getByLabelText(/sort/i);
    const selectedSort = "forks";
    userEvent.selectOptions(sortDropdown, selectedSort);

    const orderDropdown = getByLabelText(/order/i);
    const selectedOrder = "asc";
    userEvent.selectOptions(orderDropdown, selectedOrder);

    await waitFor(() => expect(getByText(/^search$/i).closest("button")).not.toHaveAttribute("disabled"));

    const searchButton = getByText(/^search$/i);
    userEvent.click(searchButton);

    items.forEach((repo, i) => {
      expect(() => getByAltText(repo.name)).toThrow();

      expect(() => getByText(repo.name)).toThrow();
    });

    let starsElement = getAllByText(/stars/i);
    expect(starsElement.length).toBe(1);

    let forksElement = getAllByText(/forks/i);
    expect(forksElement.length).toBe(1);

    let issuesElement = getAllByText(/issues/i);
    expect(issuesElement.length).toBe(1);

    let updateDateElement = getAllByText(/updated/i);
    expect(updateDateElement.length).toBe(1);

    await waitFor(() => expect(getByAltText(items[0].name)).toBeInTheDocument());

    items.forEach((repo, i) => {
      const avatarElement = getByAltText(repo.name);
      expect(avatarElement.src).toBe(repo.owner.avatar_url);

      const nameElement = getByText(repo.name);
      expect(nameElement).toBeInTheDocument();
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
      userEvent.type(inputField, query);

      const sortDropdown = getByLabelText(/sort/i);
      const selectedSort = "forks";
      userEvent.selectOptions(sortDropdown, selectedSort);

      const orderDropdown = getByLabelText(/order/i);
      const selectedOrder = "asc";
      userEvent.selectOptions(orderDropdown, selectedOrder);

      await waitFor(() => expect(getByText(/^search$/i).closest("button")).not.toHaveAttribute("disabled"));

      const searchButton = getByText(/^search$/i);
      userEvent.click(searchButton);

      await waitFor(() => expect(getByTestId(items[0].id)).toBeInTheDocument());

      items.forEach(repo => {
        const repoCard = getByTestId(repo.id);

        expect(repoCard).toBeInTheDocument();

        userEvent.click(repoCard);

        expect(window.location.href).toBe(repo.html_url);
      });
    });
  });
});
