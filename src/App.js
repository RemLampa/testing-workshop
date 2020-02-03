import React from "react";
import { ThemeProvider } from "emotion-theming";
import theme from "@rebass/preset";

import SearchForm from "./components/SearchForm";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SearchForm />
    </ThemeProvider>
  );
}

export default App;
