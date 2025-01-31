"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Poll } from "@/app/models/poll";

export default function Page() {
  const [poll, setPoll] = useState<Poll | null>(null);
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

  // Handle voting
  async function handleVote(optionId: string) {
    if (!poll) return;

    try {
      await axios.post("/api/vote", {
        pollId: poll.id,
        optionId: optionId,
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
              <div className="space-y-4">
                {poll.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    {option.optionText}
                  </button>
                ))}
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
