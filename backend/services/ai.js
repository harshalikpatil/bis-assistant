// AI LAYER: answers ONLY from the retrieved BIS text.

const LANG = { en: "English", hi: "Hindi", mr: "Marathi" };

async function generateAnswer(question, chunks, lang) {
  const context = chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.title}${c.section ? " - " + c.section : ""}\n${c.content}`
    )
    .join("\n\n");

  const system =
    `You are an assistant for Indian Standards and BIS services. ` +
    `Answer ONLY using the provided retrieved BIS source text. ` +
    `Do not use outside knowledge. If the answer is not present in the sources, ` +
    `say that the information was not found in the available BIS sources. ` +
    `Answer in ${LANG[lang] || "English"}. ` +
    `Keep the answer clear and concise.`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${process.env.AI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: system }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  `Sources:\n\n${context}\n\n` +
                  `Question: ${question}\n\n` +
                  `Answer only from the sources above.`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 800,
        },
      }),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errorText}`);
  }

  const data = await res.json();

  return (
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text || "")
      .join("") || ""
  );
}

module.exports = { generateAnswer };