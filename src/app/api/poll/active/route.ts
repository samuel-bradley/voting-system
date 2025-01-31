import { query } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /poll/active:
 *   get:
 *     summary: Retrieve the most recent active poll with options and vote counts
 *     description: Returns the most recent active poll including its options, each with a vote count.
 *     responses:
 *       200:
 *         description: Successfully retrieved poll details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 title:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 options:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       pollId:
 *                         type: string
 *                         format: uuid
 *                       optionText:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       voteCount:
 *                         type: integer
 *       404:
 *         description: No active poll found
 *       500:
 *         description: Internal server error
 */
export async function GET() {
  try {
    // Fetch the most recent active poll
    const pollResult = await query(
      "SELECT id, title, created_at FROM polls WHERE active = true ORDER BY created_at DESC LIMIT 1"
    );

    if (pollResult.rowCount === 0) {
      console.log("No active poll found");
      return NextResponse.json({ message: "No active poll found" }, { status: 404 });
    }

    const poll = pollResult.rows[0];

    // Fetch options with vote counts for the active poll
    const optionsResult = await query(
      `SELECT 
          o.id, 
          o.poll_id, 
          o.option_text, 
          o.created_at,
          COUNT(v.id) AS vote_count
        FROM options o
        LEFT JOIN votes v ON o.id = v.option_id
        WHERE o.poll_id = $1
        GROUP BY o.id
        ORDER BY o.created_at ASC`,
      [poll.id]
    );

    const options = optionsResult.rows.map((option) => ({
      id: option.id,
      pollId: option.poll_id,
      optionText: option.option_text,
      createdAt: option.created_at,
      voteCount: parseInt(option.vote_count, 10)
    }));

    return NextResponse.json({
      id: poll.id,
      title: poll.title,
      createdAt: poll.created_at,
      options,
    });
  } catch (error) {
    console.error(`Error fetching active poll: ${error}`);
    return NextResponse.json({ message: "Failed to fetch active poll" }, { status: 500 });
  }
}
