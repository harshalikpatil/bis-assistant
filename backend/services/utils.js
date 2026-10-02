// Small pure functions (easy to test)
function chunk(text, size = 800) {
  const out = []; let cur = "";
  for (const p of text.split(/\n\s*\n/).map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean)) {
    if (cur && (cur + p).length > size) { out.push(cur); cur = ""; }
    cur += (cur ? " " : "") + p;
  }
  if (cur) out.push(cur);
  return out;
}
// Vectors are normalised, so cosine similarity = dot product
function cosine(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
module.exports = { chunk, cosine };
