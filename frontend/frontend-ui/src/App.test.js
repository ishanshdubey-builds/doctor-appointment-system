import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomeComponent from "./Component/UI/HomeComponent";

test("renders the healthcare landing page and signup path", () => {
  render(
    <MemoryRouter>
      <HomeComponent />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: /healthcare that fits your life/i })
  ).toBeInTheDocument();

  expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute(
    "href",
    "/Signup"
  );
});
