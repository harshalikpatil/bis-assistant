const test = require("node:test"), assert = require("node:assert");
const { chunk, cosine } = require("../services/utils");
test("chunk keeps paragraphs and respects size", () => {
  const out = chunk("aaa\n\nbbb\n\nccc", 7);
  assert.deepStrictEqual(out, ["aaa bbb", "ccc"]);
});
test("chunk ignores empty text", () => assert.deepStrictEqual(chunk("  \n\n "), []));
test("cosine of identical unit vectors is 1", () => assert.strictEqual(cosine([1, 0], [1, 0]), 1));
test("cosine of perpendicular vectors is 0", () => assert.strictEqual(cosine([1, 0], [0, 1]), 0));
