import { render } from "@testing-library/react";

test("renders hello world without screen", () => {
  const { getByText } = render(<div>Hello world</div>);
  expect(getByText("Hello world")).toBeTruthy();
});
