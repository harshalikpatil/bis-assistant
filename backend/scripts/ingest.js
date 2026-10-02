// Loads documents from backend/knowledge/ (.pdf or .txt) into MySQL, then creates embeddings.
// Optional knowledge/sources.json: { "file.pdf": { "title": "...", "documentNo": "...", "url": "..." } }
// Only put real values there. Run again any time: loaded files are skipped, missing embeddings are filled.
const fs = require("fs"), path = require("path"), pool = require("../config/db");
const { chunk } = require("../services/utils"), { embed } = require("../services/embeddings");
const dir = path.join(__dirname, "../knowledge");
const meta = fs.existsSync(path.join(dir, "sources.json")) ? JSON.parse(fs.readFileSync(path.join(dir, "sources.json"), "utf8")) : {};
async function readText(f) {
  const full = path.join(dir, f);
  return f.endsWith(".pdf") ? (await require("pdf-parse")(fs.readFileSync(full))).text : fs.readFileSync(full, "utf8");
}
(async () => {
  for (const f of fs.readdirSync(dir).filter(f => /\.(pdf|txt)$/i.test(f) && f !== "README.txt")) {
    const m = meta[f] || {}, title = m.title || f.replace(/\.\w+$/, "");
    const [ex] = await pool.query("SELECT id FROM documents WHERE title=?", [title]);
    if (ex.length) { console.log("Already loaded:", title); continue; }
    const chunks = chunk(await readText(f));
    if (!chunks.length) { console.log("No text found (scanned PDF?):", f); continue; }
    const [d] = await pool.query("INSERT INTO documents(title,document_no,source_url) VALUES(?,?,?)", [title, m.documentNo || null, m.url || null]);
    for (const c of chunks) await pool.query("INSERT INTO chunks(document_id,content) VALUES(?,?)", [d.insertId, c]);
    console.log("Loaded:", title, "-", chunks.length, "chunks");
  }
  const [todo] = await pool.query("SELECT id,content FROM chunks WHERE embedding IS NULL");
  console.log("Creating embeddings for", todo.length, "chunks (first run downloads the model)...");
  for (const r of todo) await pool.query("UPDATE chunks SET embedding=? WHERE id=?", [JSON.stringify(await embed(r.content)), r.id]);
  console.log("Done.");
  process.exit();
})();
