(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AIDMCore = api;
})(globalThis, function () {
  const REVIEW_INTERVALS = [1, 3, 7, 21];

  function dateString(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function addDays(date, days) {
    const d = new Date(`${date}T12:00:00`);
    d.setDate(d.getDate() + days);
    return dateString(d);
  }

  function nextReview(previous, correct, today) {
    const attempts = (previous?.attempts || 0) + 1;
    if (!correct) {
      return { step: 0, due: addDays(today, REVIEW_INTERVALS[0]), attempts, lastCorrect: false, last: today };
    }
    const step = previous ? Math.min(previous.step + 1, REVIEW_INTERVALS.length - 1) : 0;
    return {
      step,
      due: addDays(today, REVIEW_INTERVALS[step]),
      attempts,
      lastCorrect: true,
      last: today
    };
  }

  function dueReviewIds(reviews, today, excluded = []) {
    const skip = new Set(excluded.map(Number));
    return Object.entries(reviews || {})
      .filter(([id, review]) => !skip.has(Number(id)) && review && review.due <= today)
      .map(([id]) => Number(id))
      .sort((a, b) => (reviews[a].due || "").localeCompare(reviews[b].due || "") || a - b);
  }

  function nextSelectedDay(selectedDays, fromDate = new Date()) {
    const codes = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    const date = new Date(fromDate);
    for (let i = 0; i < 7; i++) {
      date.setDate(date.getDate() + 1);
      if (selectedDays.includes(codes[date.getDay()])) return date;
    }
    throw new Error("No valid calendar days were selected.");
  }

  function firstSentence(item) {
    const text = String(item.m || "").trim();
    const match = text.match(/^.*?[.!?](?=\s|$)/);
    return (match ? match[0] : text).trim();
  }

  function hash(text) {
    let value = 2166136261;
    for (let i = 0; i < text.length; i++) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return value >>> 0;
  }

  function randomFrom(seed) {
    let state = seed || 1;
    return function () {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function quizFor(items, target) {
    const correct = firstSentence(target);
    const seen = new Set([correct]);
    const distractors = [];
    const candidates = [
      ...items.filter(item => item.ch === target.ch && item.id !== target.id),
      ...items.filter(item => item.ch !== target.ch && item.id !== target.id)
    ];
    for (const candidate of candidates) {
      const option = firstSentence(candidate);
      if (option && !seen.has(option)) {
        seen.add(option);
        distractors.push(option);
      }
      if (distractors.length === 3) break;
    }
    if (distractors.length < 3) throw new Error(`Not enough distinct quiz choices for topic ${target.id}`);
    const options = [correct, ...distractors];
    const random = randomFrom(hash(`${target.id}:${target.t}`));
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      question: `Which statement best describes “${target.t}”?`,
      options,
      answerIndex: options.indexOf(correct)
    };
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function validIds(ids, itemCount) {
    return Array.isArray(ids) && ids.every(id => Number.isInteger(id) && id >= 0 && id < itemCount);
  }

  function validIdMap(map, itemCount, valueCheck) {
    return isPlainObject(map) && Object.entries(map).every(([key, value]) => {
      const id = Number(key);
      return Number.isInteger(id) && id >= 0 && id < itemCount && valueCheck(value);
    });
  }

  function validProgress(data, itemCount, pathNames = []) {
    if (!isPlainObject(data) || !validIdMap(data.learned, itemCount, isPlainObject)) return false;
    if (!validIdMap(data.learned, itemCount, item =>
      isPlainObject(item) && typeof item.at === "string" &&
      (item.rev === undefined || typeof item.rev === "string"))) return false;
    if (data.stars !== undefined && !validIdMap(data.stars, itemCount, value => value === 1 || value === true)) return false;
    if (data.history !== undefined && (!Array.isArray(data.history) || !data.history.every(item =>
      isPlainObject(item) && typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date) && validIds(item.ids, itemCount) &&
      (item.reviewIds === undefined || validIds(item.reviewIds, itemCount))))) return false;
    if (data.order !== undefined && data.order !== null &&
      (!validIds(data.order, itemCount) || new Set(data.order).size !== data.order.length)) return false;
    if (data.settings !== undefined) {
      const settings = data.settings;
      if (!isPlainObject(settings)) return false;
      if (settings.order !== undefined && !["curriculum", "shuffle"].includes(settings.order)) return false;
      if (settings.path !== undefined && !pathNames.includes(settings.path)) return false;
      if (settings.recap !== undefined && typeof settings.recap !== "boolean") return false;
      if (settings.notify !== undefined && typeof settings.notify !== "boolean") return false;
      if (settings.remTime !== undefined && !/^\d{2}:\d{2}$/.test(settings.remTime)) return false;
      if (settings.v !== undefined && !Number.isInteger(settings.v)) return false;
    }
    if (data.reviews !== undefined && !validIdMap(data.reviews, itemCount, item =>
      isPlainObject(item) && Number.isInteger(item.step) && item.step >= 0 && item.step < REVIEW_INTERVALS.length &&
      typeof item.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.due) &&
      (item.attempts === undefined || (Number.isInteger(item.attempts) && item.attempts >= 0)) &&
      (item.lastCorrect === undefined || typeof item.lastCorrect === "boolean") &&
      (item.last === undefined || (typeof item.last === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.last))))) return false;
    if (data.notes !== undefined && !validIdMap(data.notes, itemCount, value => typeof value === "string")) return false;
    if (data.lastSession !== undefined && data.lastSession !== null &&
      (!isPlainObject(data.lastSession) || typeof data.lastSession.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.lastSession.date) ||
       !validIds(data.lastSession.ids, itemCount) ||
       (data.lastSession.reviewIds !== undefined && !validIds(data.lastSession.reviewIds, itemCount)) ||
       (data.lastSession.recap !== undefined && data.lastSession.recap !== null &&
        (!Number.isInteger(data.lastSession.recap) || data.lastSession.recap < 0 || data.lastSession.recap >= itemCount)))) return false;
    return true;
  }

  return { REVIEW_INTERVALS, addDays, nextReview, dueReviewIds, nextSelectedDay, quizFor, validProgress };
});
