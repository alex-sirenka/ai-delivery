const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const core = require("../learning-core.js");

const root = path.join(__dirname, "..");
const sandbox = { window: {} };
for (const file of ["curriculum.js", "curriculum-extra.js"]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), sandbox, { filename: file });
}
const items = sandbox.window.AIDM_CURRICULUM;
items.forEach((item, index) => { item.id = index; });

test("curriculum has unique, complete topics across the 16 chapters", () => {
  assert.equal(items.length, 150);
  assert.equal(new Set(items.map(item => item.t)).size, items.length);
  for (const item of items) {
    assert.ok(item.t && item.m && item.s && item.x && item.q);
    assert.ok(item.h.length >= 3);
    assert.ok(item.ch >= 0 && item.ch < 16);
    assert.ok(item.editorial.owner);
    assert.ok(item.editorial.referencesAddedOn);
  }
  assert.equal(Object.keys(sandbox.window.AIDM_PATHS).length, 5);
});

test("every chapter has current further-reading links", () => {
  const sources = sandbox.window.AIDM_CHAPTER_SOURCES;
  for (let chapter = 0; chapter < 16; chapter++) {
    assert.ok(sources[chapter].length >= 2, `chapter ${chapter + 1} needs at least two links`);
    for (const source of sources[chapter]) assert.match(source.url, /^https:\/\//);
  }
});

test("each topic gets a stable single-choice check with one correct option", () => {
  for (const item of items) {
    const quiz = core.quizFor(items, item);
    assert.equal(quiz.options.length, 4);
    assert.equal(new Set(quiz.options).size, 4);
    assert.ok(quiz.answerIndex >= 0 && quiz.answerIndex < 4);
    assert.match(quiz.question, /Which statement best describes/);
  }
});

test("spaced review follows 1, 3, 7 and 21 day intervals and resets after a miss", () => {
  let review = core.nextReview(null, true, "2026-11-25");
  assert.deepEqual({ step: review.step, due: review.due }, { step: 0, due: "2026-11-26" });
  review = core.nextReview(review, true, review.due);
  assert.deepEqual({ step: review.step, due: review.due }, { step: 1, due: "2026-11-29" });
  review = core.nextReview(review, true, review.due);
  assert.deepEqual({ step: review.step, due: review.due }, { step: 2, due: "2026-12-06" });
  review = core.nextReview(review, true, review.due);
  assert.deepEqual({ step: review.step, due: review.due }, { step: 3, due: "2026-12-27" });
  review = core.nextReview(review, false, "2026-12-27");
  assert.deepEqual({ step: review.step, due: review.due }, { step: 0, due: "2026-12-28" });
});

test("review queue excludes already-served topics and orders overdue reviews", () => {
  const reviews = {
    0: { due: "2026-11-20" },
    1: { due: "2026-11-24" },
    2: { due: "2026-11-27" }
  };
  assert.deepEqual(core.dueReviewIds(reviews, "2026-11-25", [0]), [1]);
});

test("calendar reminder starts on the next selected weekday", () => {
  const friday = new Date(2026, 10, 27, 12);
  assert.equal(core.nextSelectedDay(["MO", "TU", "WE", "TH", "FR"], friday).getDay(), 1);
  assert.equal(core.nextSelectedDay(["SA", "SU"], friday).getDay(), 6);
});

test("progress validation rejects malformed imports without accepting forged ids", () => {
  const paths = Object.keys(sandbox.window.AIDM_PATHS);
  assert.equal(core.validProgress({ learned: {}, history: [], settings: { path: "all" } }, items.length, paths), true);
  assert.equal(core.validProgress({ learned: {}, history: [{ date: "today", ids: "not-an-array" }] }, items.length, paths), false);
  assert.equal(core.validProgress({ learned: { [items.length + 2]: { at: "today" } } }, items.length, paths), false);
  assert.equal(core.validProgress({ learned: { 0: { at: 7 } } }, items.length, paths), false);
  assert.equal(core.validProgress({ learned: {}, reviews: { 0: { step: 0, due: "2026-11-30", attempts: "many" } } }, items.length, paths), false);
  assert.equal(core.validProgress({ learned: {}, settings: { path: "unknown" } }, items.length, paths), false);
});
