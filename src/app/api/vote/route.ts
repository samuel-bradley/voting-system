import { query } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /vote:
 *   post:
 *     summary: Submit a vote for an option
 *     description: Adds a vote to the specified option within a poll.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pollId
 *               - optionId
 *             properties:
 *               pollId:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the poll
 *               optionId:
 *                 type: string
 *                 format: uuid
 *                 description: The UUID of the option being voted for
 *     responses:
 *       201:
 *         description: Vote recorded successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Poll or option not found
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const { pollId, optionId } = await req.json();
    console.log("Received Vote Request:", { pollId, optionId });

    if (!pollId || !optionId) {
      return NextResponse.json({ message: "Poll ID and Option ID are required." }, { status: 400 });
    }

    try {
      // TODO - this should really be done transactionally, but doing so yields foreign key constraint violations for some reason

      // Ensure poll exists
      const pollExists = await query("SELECT id FROM polls WHERE id = $1", [pollId]);
      if (pollExists.rowCount === 0) {
        return NextResponse.json({ message: "Poll not found." }, { status: 404 });
      }

      // Ensure option exists and belongs to the correct poll
      const optionExists = await query(
        "SELECT id FROM options WHERE id = $1 AND poll_id = $2",
        [optionId, pollId]
      );
      if (optionExists.rowCount === 0) {
        return NextResponse.json({ message: "Option not found or does not belong to the specified poll." }, { status: 404 });
      }

      // Insert the vote
      await query("INSERT INTO votes (poll_id, option_id) VALUES ($1, $2)", [pollId, optionId]);

      return NextResponse.json({ message: "Vote recorded successfully" }, { status: 201 });
    } catch (error) {
      console.error("Error recording vote:", error);
      return NextResponse.json({ message: "Failed to record vote" }, { status: 500 });
    }
  } catch (error) {
    console.error("Invalid request body:", error);
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }
}
