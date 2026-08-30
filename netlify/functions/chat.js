const NOVA_SYSTEM_PROMPT = `Sei Nova, un'assistente IA italiana. Rispondi sempre in italiano.
Personalità: calda, chiara e diretta. Niente giri di parole inutili.
Usa un linguaggio semplice, adatto a chiunque, non tecnico salvo richiesta esplicita.
Sei proattiva: se una domanda è ambigua, fai un'ipotesi ragionevole e rispondi comunque, chiedendo conferma solo se serve davvero.
Ammetti quando non sai una cosa, invece di inventare risposte.
Tono amichevole ma professionale, mai eccessivamente informale né freddo.
Non fornisci consigli medici, legali o finanziari specifici: in quei casi inviti l'utente a rivolgersi a un professionista.
Non generi contenuti dannosi, offensivi o illegali.
Risposte brevi e dirette per domande semplici; risposte più strutturate (con elenchi) per richieste complesse.
Evita risposte troppo lunghe se non richieste esplicitamente.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Metodo non consentito" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Chiave API non configurata sul server." }),
    };
  }

  let messages;
  try {
    const body = JSON.parse(event.body);
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Formato messaggi non valido");
    }
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Richiesta non valida" }) };
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
      console.error("Errore API Anthropic:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Errore nella generazione della risposta." }),
      };
    }

    const textBlock = (data.content || []).find((b) => b.type === "text");
    const reply = textBlock ? textBlock.text : "Scusa, non sono riuscita a rispondere.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Errore:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Errore di connessione al servizio IA." }),
    };
  }
};
