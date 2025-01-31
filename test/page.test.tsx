import Page from "@/app/page";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { act } from "react";
import "@testing-library/jest-dom";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Page Component", () => {
  it("renders a poll and allows voting", async () => {
    const mockPoll = {
      id: "1",
      title: "What's the best programming language?",
      options: [
        { id: "1", optionText: "Python", voteCount: 0 },
        { id: "2", optionText: "C#", voteCount: 0 },
        { id: "3", optionText: "It's a silly question", voteCount: 0 },
      ],
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockPoll });

    await act(async () => render(<Page />));

    // Confirm the title and options show up
    expect(
      screen.getByText("What's the best programming language?")
    ).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("C#")).toBeInTheDocument();
    expect(screen.getByText("It's a silly question")).toBeInTheDocument();

    // Vote for an option
    const optionButton = screen.getByText("Python");
    fireEvent.click(optionButton);
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    expect(mockedAxios.post).toHaveBeenCalledWith("/api/vote", {
      pollId: "1",
      optionId: "1",
    });
  });
});
