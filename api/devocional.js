export default async function handler(req, res) {
  // 🔓 CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 🔁 Preflight
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
- Pergunta para meditar
- Oração final

Seja humano, simples e profundo.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer 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`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // 🔍 DEBUG (pode remover depois)
    console.log("OPENROUTER RESPONSE:", JSON.stringify(data, null, 2));

    // 🧠 pega o texto da resposta
    const text = data?.choices?.[0]?.message?.content;

    // 🚨 se der erro da API
    if (data.error) {
      return res.status(500).json({
        error: data.error.message
      });
    }

    return res.status(200).json({
      text: text || "Não foi possível gerar o devocional."
    });

  } catch (error) {
    console.error("ERRO GERAL:", error);

    return res.status(500).json({
      error: error.message
    });
  }
}
