import { query } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /poll:
 *   post:
 *     summary: Create a new poll
 *     description: Creates a new poll with a title and options. The poll starts as active, and options have zero votes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - options
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the poll
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: A list of option texts for the poll
 *     responses:
 *       201:
 *         description: Poll created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pollId:
 *                   type: string
 *                   description: The UUID of the created poll
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    const { title, options } = await req.json();

    if (!title || !Array.isArray(options) || options.length < 2 || options.length > 7) {
      return NextResponse.json({ message: "Invalid input. A poll must have a title and 2-7 options." }, { status: 400 });
    }

    try {
      // TODO - this should really be done transactionally, but doing so yields foreign key constraint violations for some reason

      // Update existing active poll to be inactive
      await query("UPDATE polls SET active = false WHERE active = true");

      // Insert the poll and return the generated UUID
      const pollResult = await query(
        "INSERT INTO polls (title, active) VALUES ($1, true) RETURNING id",
        [title]
      );
      const pollId = pollResult.rows[0].id;

      // Insert the options linked to the poll
      const optionQueries = options.map((optionText) =>
        query("INSERT INTO options (poll_id, option_text) VALUES ($1, $2)", [pollId, optionText])
      );
      await Promise.all(optionQueries);

      return NextResponse.json({ pollId }, { status: 201 });
    } catch (error) {
      console.error("Error creating poll:", error);
      return NextResponse.json({ message: "Failed to create poll" }, { status: 500 });
    }
  } catch (error) {
    console.error("Invalid request body:", error);
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }
}
