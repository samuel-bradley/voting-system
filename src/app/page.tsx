"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Poll } from "@/app/models/poll";

export default function Page() {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [voted, setVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the latest active poll
  async function fetchPoll() {
    try {
      const response = await axios.get("/api/poll/active");
      setPoll(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setPoll(null);
      } else {
        setError("Failed to load poll.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPoll();
  }, []);

  async function handleSubmitVote() {
    if (!poll || !selectedOption) return;

    try {
      await axios.post("/api/vote", {
        pollId: poll.id,
        optionId: selectedOption,
      });

      await fetchPoll();
      setVoted(true);
    } catch (err) {
      setError("Failed to submit vote.");
    }
  }

  function votePercentage(optionVoteCount: number): number {
    if (!poll) return 0;
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
    if (totalVotes === 0) return 0;
    return (optionVoteCount / totalVotes) * 100;
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-900 to-purple-700 p-4 text-white">
      <div className="w-full max-w-md bg-purple-800 shadow-lg rounded-xl p-6">
        {loading && <p className="text-center">Loading poll...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}
        {!loading && !error && !poll && (
          <p className="text-center">No active poll available.</p>
        )}

        {poll && (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">
              {poll.title}
            </h2>

            {!voted ? (
              <div>
                <div className="space-y-4">
                  {poll.options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSelectedOption(option.id)}
                      className={`w-full py-3 rounded-lg transition-all text-white font-semibold ${
                        selectedOption === option.id
                          ? "bg-purple-600 ring-2 ring-white"
                          : "bg-purple-500 hover:bg-purple-600"
                      }`}
                    >
                      {option.optionText}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmitVote}
                  disabled={!selectedOption}
                  className={`w-full mt-6 py-3 text-lg font-bold rounded-lg transition-all ${
                    selectedOption
                      ? "bg-white text-purple-800 hover:bg-gray-200"
                      : "bg-gray-400 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {poll.options.map((option) => (
                  <div
                    key={option.id}
                    className="bg-purple-700 rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-purple-500 text-center text-white font-semibold py-2"
                      style={{
                        width: `${votePercentage(option.voteCount)}%`,
                      }}
                    >
                      {option.optionText} -{" "}
                      {votePercentage(option.voteCount).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
