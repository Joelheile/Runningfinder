const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});

export async function POST(request: Request) {
  const { message } = await request.json();

  const responseGenerate = async (message: string) => {
    const answer = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a that does exactly what asked for",
        },
        { role: "user", content: ` "${message}"` },
      ],
    });

    return answer; 
  };

  const answer = await responseGenerate(message);

  return new Response(JSON.stringify({
    message,
    answer,
  }));
}
