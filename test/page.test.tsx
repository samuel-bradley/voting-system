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

  it("displays correct percentages after voting", async () => {
    const mockPollBeforeVote = {
      id: "1",
      title: "Who will win the Premier League?",
      options: [
        { id: "1", optionText: "Manchester City", voteCount: 2 },
        { id: "2", optionText: "Arsenal", voteCount: 1 },
        { id: "3", optionText: "Liverpool", voteCount: 2 },
      ],
    };
    const mockPollAfterVote = {
      ...mockPollBeforeVote,
      options: [
        { id: "1", optionText: "Manchester City", voteCount: 3 },
        { id: "2", optionText: "Arsenal", voteCount: 1 },
        { id: "3", optionText: "Liverpool", voteCount: 2 },
      ],
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockPollBeforeVote });
    mockedAxios.post.mockResolvedValueOnce({});
    mockedAxios.get.mockResolvedValueOnce({ data: mockPollAfterVote });

    await act(async () => render(<Page />));

    // Vote for an option
    const optionButton = screen.getByText("Manchester City");
    fireEvent.click(optionButton);
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    // Assert percentages are displayed correctly
    expect(await screen.findByText("Manchester City - 50.0%")).toBeInTheDocument();
    expect(screen.getByText("Arsenal - 16.7%")).toBeInTheDocument();
    expect(screen.getByText("Liverpool - 33.3%")).toBeInTheDocument();
  });
});
