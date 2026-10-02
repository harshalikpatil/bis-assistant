// RETRIEVAL LAYER: meaning-based search (embeddings). Falls back to keyword search if no embeddings exist yet.
const pool = require("../config/db");
const { embed } = require("./embeddings");
const { cosine } = require("./utils");
const MIN_SCORE = parseFloat(process.env.MIN_SCORE || "0.80"); // tune this using real questions
let cache = null;
async function load() {
  if (!cache) {
    const [rows] = await pool.query(`SELECT c.content,c.section,c.embedding,d.title,d.document_no,d.source_url
      FROM chunks c JOIN documents d ON d.id=c.document_id WHERE c.embedding IS NOT NULL`);
    cache = rows.map(r => ({ ...r, vec: typeof r.embedding === "string" ? JSON.parse(r.embedding) : r.embedding }));
  }
  return cache;
}
async function keywordSearch(q, limit) {
  const [rows] = await pool.query(`SELECT c.content,c.section,d.title,d.document_no,d.source_url
    FROM chunks c JOIN documents d ON d.id=c.document_id
    WHERE MATCH(c.content) AGAINST(? IN NATURAL LANGUAGE MODE)
    ORDER BY MATCH(c.content) AGAINST(? IN NATURAL LANGUAGE MODE) DESC LIMIT ?`, [q, q, limit]);
  return rows;
}
async function retrieve(question, limit = 4) {
  const all = await load();
  if (!all.length) return keywordSearch(question, limit);
  const qv = await embed(question, "query");
  return all.map(c => ({ ...c, score: cosine(qv, c.vec) }))
    .filter(c => c.score >= MIN_SCORE).sort((a, b) => b.score - a.score).slice(0, limit);
}
module.exports = { retrieve };
