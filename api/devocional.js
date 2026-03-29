export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { emocao, texto } = req.body;

    const prompt = `
Você é um assistente cristão acolhedor.

Crie um devocional com base em:
Emoção: ${emocao}
Contexto: ${texto}

Inclua:
- Versículo bíblico
- Reflexão
- Pergunta
- Oração

Seja humano, simples e profundo.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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 ",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENROUTER:", data);

    const text = data.choices?.[0]?.message?.content;

    return res.status(200).json({
      text: text || "Erro ao gerar devocional"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
}
