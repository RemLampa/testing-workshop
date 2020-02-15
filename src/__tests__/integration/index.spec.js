import React from "react";
import { render } from "@testing-library/react";

import SearchForm from "../../components/SearchForm";

describe("INTEGRATION TESTS", () => {
  describe("SearchForm Component", () => {
    it("should have a header title", () => {
      const { getByText } = render(<SearchForm />);

      const headerElement = getByText(/github/i);
      expect(headerElement).toBeTruthy();

      const expectedText = "GitHub Respositories Search";
      expect(headerElement.textContent).toBe(expectedText);
    });
  });
});
