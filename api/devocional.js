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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content;

    return res.status(200).json({
      text: text || "Não foi possível gerar o devocional."
    });

  } catch (error) {
    console.error("ERRO:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
