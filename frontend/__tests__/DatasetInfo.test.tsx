import { render, waitFor } from "@testing-library/react";
import DatasetDetailsPage from "@/pages/datasets/[name]";
import { Provider } from "react-redux";
import { store } from "@/store";

// Mock router
jest.mock("next/router", () => ({
  useRouter: () => ({
    query: { name: "imdb" },
  }),
}));

// Mock API
jest.mock("@/services/api", () => ({
  get: jest.fn((url: string) => {
    if (url === "/datasets/info/imdb") {
      return Promise.resolve({
        data: {
          id: "imdb",
          lastModified: "2024-05-15",
          tags: ["text", "movie", "classification"],
          downloads: 123456,
          likes: 789,
          private: false,
          cardData: { summary: "A movie dataset." },
        },
      });
    }
    return Promise.reject("Unknown endpoint");
  }),
}));

test("renders dataset info correctly", async () => {
  const { getByText } = render(
    <Provider store={store}>
      <DatasetDetailsPage />
    </Provider>
  );

  await waitFor(() => {
    expect(getByText("Dataset: imdb")).toBeInTheDocument();
    expect(getByText("text")).toBeInTheDocument();
    expect(getByText("Downloads:")).toBeInTheDocument();
    expect(getByText("Likes:")).toBeInTheDocument();
    expect(getByText("A movie dataset.")).toBeInTheDocument();
  });
});
