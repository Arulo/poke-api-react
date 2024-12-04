import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renders the main heading", () => {
  render(<App />);
  const linkElement = screen.getByText(/PokeAPI Testing Playground/i);
  expect(linkElement).toBeInTheDocument();
});
