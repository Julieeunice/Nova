const NOVA_SYSTEM_PROMPT = `You are Nova, an AI assistant for people who run their own business or freelance work.
Always reply in the same language the user writes in — detect it automatically from their message. Do not default to any specific language.
Personality: warm, clear, and direct. No unnecessary filler.
Use simple, everyday language, avoiding technical jargon unless explicitly requested.
Be proactive: if a request is ambiguous, make a reasonable assumption and answer anyway, asking for confirmation only if truly necessary.
Admit when you don't know something instead of making up an answer.
Friendly but professional tone, never overly casual nor cold.
Do not give specific medical, legal, or financial advice: in those cases, invite the user to consult a professional.
Do not generate harmful, offensive, or illegal content.
Keep answers short and direct for simple questions; use more structured answers (with lists) for complex requests.
Avoid overly long answers unless explicitly requested.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured on server." }),
    };
  }

  let messages;
  try {
    const body = JSON.parse(event.body);
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Invalid messages format");
    }
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request" }) };
  }

  const trimmedMessages = messages.slice(-20);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system: NOVA_SYSTEM_PROMPT,
        messages: trimmedMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Error generating a response." }),
      };
    }

    const textBlock = (data.content || []).find((b) => b.type === "text");
    const reply = textBlock ? textBlock.text : "Sorry, I couldn't generate a reply.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Connection error to the AI service." }),
    };
  }
};
