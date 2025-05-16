import { render } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import { store } from "@/store";

// Mock useRouter so router.pathname doesn't crash
jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/datasets", // fake current path
    push: jest.fn(),       // mock redirect after logout
  }),
}));

test("renders login when not authenticated", () => {
  const { getByText } = render(
    <Provider store={store}>
      <Navbar />
    </Provider>
  );

  expect(getByText("Login")).toBeInTheDocument();
  expect(getByText("Register")).toBeInTheDocument();
  expect(getByText("🧠 Dataset Explorer")).toBeInTheDocument();
});
