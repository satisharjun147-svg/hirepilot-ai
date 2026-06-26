import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App routing", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  test("renders the ATS checker screen when the URL requests it", () => {
    window.history.pushState({}, "", "/?feature=ats");
    render(<App />);

    expect(screen.getByText(/ATS Checker/i)).toBeInTheDocument();
  });
});
