const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(request: Request) {
  const { message } = await request.json();

  const responseGenerate = async (message: string) => {
    const answer = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that does exactly what asked for",
        },
        { role: "user", content: ` "${message}"` },
      ],
    });

    return answer;
  };

  const answer = await responseGenerate(message);

  return new Response(
    JSON.stringify({
      message,
      answer,
    }),
  );
}

/**
 * @swagger
 * /api/ai:
 *   post:
 *     tags:
 *       - ai
 *     summary: Get AI-generated response.
 *     description: Uses OpenAI's GPT-4 to generate a response to the user's message.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: User's question or message
 *     responses:
 *       200:
 *         description: AI-generated response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The original user message
 *                 answer:
 *                   type: object
 *                   description: OpenAI API response object
 *       400:
 *         description: Bad request, missing message field.
 *       500:
 *         description: Failed to generate AI response.
 */
