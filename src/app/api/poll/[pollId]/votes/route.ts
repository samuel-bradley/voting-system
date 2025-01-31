import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool();

/**
 * @swagger
 * /api/poll/{pollId}/votes:
 *   get:
 *     summary: Get votes for a poll
 *     description: Returns all votes for the given poll ID in ascending order.
 *     parameters:
 *       - in: path
 *         name: pollId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the poll
 *     responses:
 *       200:
 *         description: Successfully retrieved votes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pollId:
 *                     type: string
 *                   optionId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Poll not found
 */
export async function GET(_: Request, { params }: { params: { pollId: string } }) {
  const { pollId } = params;

  try {
    const result = await pool.query(
      "SELECT poll_id, option_id, created_at FROM votes WHERE poll_id = $1 ORDER BY created_at ASC",
      [pollId]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
