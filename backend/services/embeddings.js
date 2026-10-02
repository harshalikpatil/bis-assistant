// Turns text into numbers (vectors) so similar MEANINGS match, even across English/Hindi/Marathi.
// Runs locally with a free multilingual model: no extra API key. First run downloads ~100 MB.
let extractor;
async function embed(text, kind = "passage") { // kind: "query" or "passage" (the model expects this prefix)
  if (!extractor) {
    const { pipeline } = await import("@xenova/transformers");
    extractor = await pipeline("feature-extraction", "Xenova/multilingual-e5-small");
  }
  const out = await extractor(`${kind}: ${text}`, { pooling: "mean", normalize: true });
  return Array.from(out.data);
}
module.exports = { embed };
