const router = require("express").Router();
const pool = require("../config/db");
const { retrieve } = require("../services/retrieval");
const { generateAnswer } = require("../services/ai");

const NO_SOURCE = {
  en: "I could not find this in the BIS sources available to me. Please check the official BIS website or rephrase your question.",
  hi: "उपलब्ध बीआईएस स्रोतों में मुझे यह जानकारी नहीं मिली। कृपया बीआईएस की आधिकारिक वेबसाइट देखें या प्रश्न दोबारा लिखें।",
  mr: "उपलब्ध बीआयएस स्रोतांमध्ये मला ही माहिती सापडली नाही. कृपया बीआयएसचे अधिकृत संकेतस्थळ पहा किंवा प्रश्न पुन्हा लिहा."
};

// POST /api/chat  body: { question, lang }  ->  { answer, sources[] }
router.post("/", async (req, res) => {
  const question = String(req.body.question || "").trim().slice(0, 500);
  const lang = ["en", "hi", "mr"].includes(req.body.lang) ? req.body.lang : "en";
  if (!question) return res.status(400).json({ error: "Question is required." });
  try {
    const chunks = await retrieve(question);
    // No source found: do NOT call the AI, so it cannot make something up.
    const answer = chunks.length ? await generateAnswer(question, chunks, lang) : NO_SOURCE[lang];
    const sources = chunks.map(c => ({ title: c.title, documentNo: c.document_no, section: c.section, url: c.source_url, excerpt: c.content }));
    await pool.query("INSERT INTO chat_logs(question,answer,lang,had_sources) VALUES(?,?,?,?)", [question, answer, lang, chunks.length > 0]);
    res.json({ answer, sources });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
module.exports = router;
