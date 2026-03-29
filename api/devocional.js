export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { emocao, texto } = req.body;

    const prompt = `
Você é um assistente cristão acolhedor, sensível e encorajador.

Crie um devocional personalizado com base em:

Emoção: ${emocao}
Contexto: ${texto}

Siga esta estrutura:

1. Título do devocional (curto e impactante)
2. Versículo bíblico (com referência)
3. Reflexão (profunda, mas simples e acolhedora)
4. Pergunta para meditação pessoal
5. Oração final (emocional e sincera)

Use linguagem humana, íntima e espiritual.
Evite respostas genéricas.
Fale como alguém que se importa de verdade.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Devocional App"
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

    console.log("OPENROUTER RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      return res.status(500).json({
        error: data.error.message
      });
    }

    const text = data?.choices?.[0]?.message?.content;

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
