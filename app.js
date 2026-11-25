const CHAPTERS = [
  "Role, responsibilities and business context", "AI and model foundations",
  "Prompts, context and output contracts", "Enterprise retrieval and RAG",
  "Agents, orchestration and integrations", "Evaluation and evidence",
  "Data and knowledge management", "Software and cloud literacy",
  "Security, privacy and responsible AI", "Discovery and product definition",
  "Delivery management and stage gates", "Economics, operations and adoption",
  "Platforms and frameworks", "End-to-end worked delivery case",
  "Development roadmap and interview evidence", "Templates and decision checklists"
];
const ITEMS = window.AIDM_CURRICULUM;
const PATHS = window.AIDM_PATHS;
const SOURCES = window.AIDM_CHAPTER_SOURCES;
ITEMS.forEach((item, index) => { item.id = index; });

const KEY = "aidm-academy-v1";
const WPM = 150;
const BUDGET = 6 * WPM;
const SETV = 3;
const DEF = {
  learned: {}, stars: {}, history: [], order: null, reviews: {}, notes: {},
  settings: { v: SETV, order: "curriculum", recap: false, notify: false, remTime: "09:00", path: "all" },
  lastSession: null
};
const clone = value => JSON.parse(JSON.stringify(value));
const $ = id => document.getElementById(id);
let loadWarning = "";
let migrationNeeded = false;
let storageBlocked = false;

function load() {
  let serialized;
  try {
    serialized = localStorage.getItem(KEY);
  } catch (error) {
    console.error("Could not read saved progress.", error);
    storageBlocked = true;
    loadWarning = "Browser storage is unavailable. Progress may not persist in this browser.";
    return clone(DEF);
  }
  if (!serialized) return clone(DEF);
  try {
    const stored = JSON.parse(serialized);
    if (!AIDMCore.validProgress(stored, ITEMS.length, Object.keys(PATHS))) {
      storageBlocked = true;
      loadWarning = "Saved progress is invalid and has been left untouched. Import a valid backup or reset progress in Settings before continuing.";
      console.error("Saved progress failed validation.");
      return clone(DEF);
    }
    const state = {
      ...clone(DEF),
      ...stored,
      reviews: stored.reviews || {},
      notes: stored.notes || {},
      history: stored.history || [],
      settings: { ...DEF.settings, ...(stored.settings || {}), v: SETV }
    };
    if ((!stored.settings || stored.settings.v !== SETV) && !stored.reviews) {
      Object.keys(state.learned).forEach(id => {
        state.reviews[id] = {
          step: 0,
          due: AIDMCore.addDays(fmt(new Date()), Number(id) % 14),
          attempts: 0,
          lastCorrect: false
        };
      });
      migrationNeeded = true;
    }
    return state;
  } catch (error) {
    console.error("Could not parse saved progress.", error);
    storageBlocked = true;
    loadWarning = "Saved progress could not be read and has been left untouched. Import a valid backup or reset progress in Settings before continuing.";
    return clone(DEF);
  }
}

let S = load();
if (migrationNeeded) save();
function status(message) {
  const element = $("appStatus");
  if (element) element.textContent = message;
}
function save() {
  if (storageBlocked) {
    status("Saving is paused to protect the existing invalid data. Import a valid backup or explicitly reset progress in Settings.");
    return false;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
    return true;
  } catch (error) {
    console.error("Could not save progress.", error);
    status("Progress could not be saved in this browser. Export a backup before leaving.");
    return false;
  }
}
function esc(value) {
  const element = document.createElement("div");
  element.textContent = value == null ? "" : String(value);
  return element.innerHTML;
}
const attr = value => esc(value).replace(/"/g, "&quot;");
function fmt(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" +
    String(date.getDate()).padStart(2, "0");
}
const today = () => fmt(new Date());
const wc = value => String(value || "").trim().split(/\s+/).filter(Boolean).length;
const text = item => [item.t, item.m, item.s, item.h.join(" "), item.tl, item.x, item.q].join(" ");
const words = item => wc(text(item));
const recapWords = item => wc(item.t + " " + item.m);
const mins = count => Math.max(1, Math.round(count / WPM));
const currentPath = () => PATHS[S.settings.path] || PATHS.all;
const inPath = item => currentPath().chapters.includes(item.ch);
const pathItems = () => ITEMS.filter(inPath);

function sequence() {
  if (S.settings.order === "shuffle") {
    if (!S.order || S.order.length !== ITEMS.length || new Set(S.order).size !== ITEMS.length) {
      const ids = ITEMS.map(item => item.id);
      for (let i = ids.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ids[i], ids[j]] = [ids[j], ids[i]];
      }
      S.order = ids;
      save();
    }
    return S.order.filter(id => inPath(ITEMS[id]));
  }
  return pathItems().map(item => item.id);
}
const remaining = () => sequence().filter(id => !S.learned[id]);
function dueReviews() {
  const alreadyServed = S.history
    .filter(session => session.date === today())
    .flatMap(session => session.reviewIds || []);
  return AIDMCore.dueReviewIds(S.reviews, today(), alreadyServed).filter(id => ITEMS[id] && inPath(ITEMS[id]));
}
function pickNew(budget) {
  const ids = remaining();
  if (!ids.length) return [];
  return ids.length > 1 && words(ITEMS[ids[0]]) + words(ITEMS[ids[1]]) <= budget ?
    [ids[0], ids[1]] : [ids[0]];
}
function pickRecap(excluded = []) {
  const skip = new Set(excluded);
  const ids = Object.keys(S.learned).map(Number).filter(id => ITEMS[id] && inPath(ITEMS[id]) && !skip.has(id));
  if (!ids.length) return null;
  ids.sort((a, b) => (S.learned[a].rev || S.learned[a].at || "").localeCompare(S.learned[b].rev || S.learned[b].at || ""));
  return ids[0];
}

function start() {
  const reviewIds = dueReviews().slice(0, 2);
  const remainingIds = remaining();
  if (!remainingIds.length && !reviewIds.length) {
    render();
    return;
  }
  const recap = S.settings.recap && remainingIds.length ? pickRecap(reviewIds) : null;
  const reviewBudget = reviewIds.length * 80;
  const ids = pickNew(BUDGET - reviewBudget - (recap !== null ? recapWords(ITEMS[recap]) : 0));
  const now = new Date().toISOString();
  ids.forEach(id => { if (!S.learned[id]) S.learned[id] = { at: now }; });
  if (recap !== null && S.learned[recap]) S.learned[recap].rev = now;
  S.lastSession = { date: today(), ids, reviewIds, recap };
  S.history.unshift({ date: today(), ids, reviewIds });
  if (S.history.length > 200) S.history.length = 200;
  save();
  render();
  $("session").scrollIntoView({ behavior: "smooth" });
}

function sourceMarkup(item) {
  const sources = SOURCES[item.ch] || [];
  if (!sources.length) return "";
  return `<div class="sec sources"><h4>Chapter sources and further reading</h4>
    <ul class="source-list">${sources.map(source =>
      `<li><a href="${attr(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a></li>`
    ).join("")}</ul><p class="muted">References curated November 2026. Confirm current guidance before relying on it.</p></div>`;
}

function quizMarkup(item, scope) {
  const quiz = AIDMCore.quizFor(ITEMS, item);
  const group = `${scope}-${item.id}`;
  return `<section class="quiz" aria-label="Knowledge check for ${attr(item.t)}">
    <fieldset><legend>Single-choice knowledge check</legend><p>${esc(quiz.question)}</p>
      ${quiz.options.map((option, index) =>
        `<label class="quiz-option"><input type="radio" name="${group}" value="${index}"><span>${esc(option)}</span></label>`
      ).join("")}
    </fieldset>
    <div class="actions"><button type="button" class="btn" onclick="checkQuiz(${item.id},${quiz.answerIndex},'${group}',this)">Check answer</button></div>
    <p class="quiz-feedback muted" aria-live="polite"></p>
  </section>`;
}

function card(item, kind, scope = "session") {
  if (kind === "recap") {
    return `<article class="card review"><span class="badge">Quick recap · Ch ${item.ch + 1}. ${esc(CHAPTERS[item.ch])}</span>
      <h2>${esc(item.t)}</h2><p>${esc(item.m)}</p></article>`;
  }
  const bookmarked = S.stars[item.id];
  const review = S.reviews[item.id];
  return `<article class="card ${kind === "review" ? "review" : ""}">
    <span class="badge">Ch ${item.ch + 1}. ${esc(CHAPTERS[item.ch])}</span>
    <span class="badge">~${mins(words(item))} min</span>
    ${kind === "review" ? '<span class="badge">Spaced review</span>' : ""}
    <h2>${esc(item.t)}</h2>
    <div class="sec"><h4>What it means</h4><p>${esc(item.m)}</p></div>
    <div class="sec scen"><h4>Real-life scenario</h4><p>${esc(item.s)}</p></div>
    <div class="sec"><h4>How to do it</h4><ol>${item.h.map(step => `<li>${esc(step)}</li>`).join("")}</ol></div>
    ${item.tl ? `<div class="sec tools"><h4>Tools</h4><p>${esc(item.tl)}</p></div>` : ""}
    <div class="sec mistake"><h4>Common mistake</h4><p>${esc(item.x)}</p></div>
    <div class="sec q"><h4>Question to ask on your project</h4><p>${esc(item.q)}</p></div>
    <div class="sec exercise"><h4>Practice: capture your answer</h4>
      <p><strong>Try this:</strong> ${esc(item.h[0])}</p>
      <textarea aria-label="Practice notes for ${attr(item.t)}" data-note-id="${item.id}" onchange="saveNote(${item.id},this)">${esc(S.notes[item.id] || "")}</textarea>
      <p class="muted">Notes stay in this browser and are included in progress exports.</p>
    </div>
    ${quizMarkup(item, scope)}
    ${sourceMarkup(item)}
    <p class="muted">${review ? `Review step ${review.step + 1} of 4 · next due ${esc(review.due)}` : "Complete the check to schedule a spaced review."}</p>
    <p class="muted">Content owner: ${esc(item.editorial?.owner || "Unassigned")} · Content updated: ${esc(item.editorial?.contentUpdatedOn || "date not recorded")} · Last fact-check: ${esc(item.editorial?.lastFactCheck || "not recorded")} · Sources added: ${esc(item.editorial?.referencesAddedOn || "not recorded")}</p>
    <div class="actions"><button type="button" class="btn ${bookmarked ? "on" : ""}" onclick="star(${item.id},this)">${bookmarked ? "★ Bookmarked" : "☆ Bookmark"}</button></div>
  </article>`;
}

function checkQuiz(id, correctIndex, group, button) {
  const selected = document.querySelector(`input[name="${group}"]:checked`);
  const feedback = button.closest(".quiz").querySelector(".quiz-feedback");
  if (!selected) {
    feedback.textContent = "Choose one answer first.";
    return;
  }
  const correct = Number(selected.value) === correctIndex;
  const review = AIDMCore.nextReview(S.reviews[id], correct, today());
  S.reviews[id] = review;
  if (S.learned[id]) S.learned[id].rev = new Date().toISOString();
  button.closest(".quiz").querySelectorAll("input").forEach(input => { input.disabled = true; });
  button.disabled = true;
  feedback.textContent = correct ?
    `Correct. Next review is due ${review.due}.` :
    `Not quite. The best answer is shown in the lesson above. We'll revisit this topic on ${review.due}.`;
  save();
  renderProgress();
  renderLibrary();
  $("s-left").textContent = dueReviews().length;
}

function saveNote(id, field) {
  S.notes[id] = field.value;
  if (save()) status("Practice note saved.");
}
function star(id, element) {
  if (S.stars[id]) delete S.stars[id];
  else S.stars[id] = 1;
  save();
  element.classList.toggle("on");
  element.textContent = S.stars[id] ? "★ Bookmarked" : "☆ Bookmark";
}

function sessionsLeft() {
  let ids = remaining();
  let count = 0;
  while (ids.length) {
    ids = ids.slice(ids.length > 1 && words(ITEMS[ids[0]]) + words(ITEMS[ids[1]]) <= BUDGET ? 2 : 1);
    count++;
  }
  return count;
}
function streak() {
  const dates = new Set(S.history.map(session => session.date));
  const date = new Date();
  let count = 0;
  if (!dates.has(fmt(date))) date.setDate(date.getDate() - 1);
  while (dates.has(fmt(date))) {
    count++;
    date.setDate(date.getDate() - 1);
  }
  return count;
}
function renderLearn() {
  const items = pathItems();
  const done = items.filter(item => S.learned[item.id]).length;
  const total = items.length;
  const rem = total - done;
  const due = dueReviews();
  $("bar").style.width = (total ? done / total * 100 : 0) + "%";
  $("bar").parentElement.setAttribute("aria-valuenow", String(total ? Math.round(done / total * 100) : 0));
  $("s-learned").textContent = `${done} / ${total}`;
  $("s-left").textContent = due.length;
  $("s-sessions").textContent = sessionsLeft();
  $("s-streak").textContent = streak();
  const button = $("startBtn");
  const last = S.lastSession;
  button.disabled = !rem && !due.length;
  button.textContent = !rem && !due.length ? "Path complete" :
    due.length && !rem ? `Review ${due.length} due` : last && last.date === today() ? "Start: give me more" : "Start";
  $("lastInfo").textContent = last ?
    (last.date === today() ? "Today's session is below." : `Your last session (${last.date}) is below. Press Start for today's topics.`) : "";

  if (!last) {
    $("session").innerHTML = `<div class="panel muted center">${total} topics in ${esc(currentPath().name)}. Start with a lesson or take the placement check in Settings.</div>`;
    return;
  }
  const ids = last.ids || [];
  const reviewIds = last.reviewIds || [];
  const hasRecap = last.recap !== null && last.recap !== undefined && ITEMS[last.recap];
  const wordCount = ids.reduce((sum, id) => sum + (ITEMS[id] ? words(ITEMS[id]) : 0), 0) +
    (hasRecap ? recapWords(ITEMS[last.recap]) : 0);
  let heading = `<p class="muted center">${reviewIds.length} review check${reviewIds.length === 1 ? "" : "s"} · ${ids.length} new topic${ids.length === 1 ? "" : "s"}${hasRecap ? " + recap" : ""} · about ${mins(wordCount + reviewIds.length * 80)} min</p>`;
  if (!rem) heading = `<div class="panel center"><h2>${esc(currentPath().name)} complete.</h2><p class="muted">Keep your knowledge fresh with due reviews or choose another path in Settings.</p></div>` + heading;
  $("session").innerHTML = heading +
    reviewIds.filter(id => ITEMS[id]).map(id => card(ITEMS[id], "review")).join("") +
    ids.filter(id => ITEMS[id]).map(id => card(ITEMS[id], "lesson")).join("") +
    (hasRecap ? card(ITEMS[last.recap], "recap") : "");
}

function isMastered(id) {
  return Boolean(S.reviews[id] && S.reviews[id].lastCorrect);
}
function renderProgress() {
  $("chapters").innerHTML = CHAPTERS.map((chapter, index) => {
    const items = ITEMS.filter(item => item.ch === index);
    const reached = items.filter(item => S.learned[item.id]).length;
    const mastered = items.filter(item => isMastered(item.id)).length;
    const complete = items.length > 0 && reached === items.length && mastered === items.length;
    return `<div class="ch-row"><span>${complete ? "★ " : ""}${index + 1}. ${esc(chapter)}</span>
      <div class="bar" role="progressbar" aria-label="${esc(chapter)}" aria-valuemin="0" aria-valuemax="${items.length}" aria-valuenow="${reached}"><div style="width:${items.length ? reached / items.length * 100 : 0}%"></div></div>
      <span class="muted">${mastered}/${reached}/${items.length}</span></div>`;
  }).join("");
  $("milestones").innerHTML = CHAPTERS.map((chapter, index) => {
    const items = ITEMS.filter(item => item.ch === index);
    const earned = items.length > 0 && items.every(item => isMastered(item.id));
    return `<span class="badge ${earned ? "earned" : ""}" ${earned ? 'title="All topics passed a knowledge check"' : ""}>${earned ? "★ " : ""}${esc(chapter)}</span>`;
  }).join("");
  $("history").innerHTML = S.history.length ? S.history.slice(0, 60).map(session => {
    const titles = [...(session.reviewIds || []), ...(session.ids || [])]
      .filter(id => ITEMS[id]).map(id => esc(ITEMS[id].t));
    return `<div>${esc(session.date)}: ${titles.join(" · ") || "Review session"}</div>`;
  }).join("") : "No sessions yet.";
}

function renderLibrary() {
  const query = $("search").value.toLowerCase();
  const onlyStarred = $("onlyStar").checked;
  const showLocked = $("showLocked").checked;
  const list = sequence().map(id => ITEMS[id]).filter(item => {
    const reached = Boolean(S.learned[item.id]);
    if (!reached && !showLocked) return false;
    if (onlyStarred && !S.stars[item.id]) return false;
    return !query || (reached ? text(item) : item.t).toLowerCase().includes(query);
  });
  $("libList").innerHTML = list.length ? list.map(item => {
    const reached = Boolean(S.learned[item.id]);
    return `<button type="button" class="lib-item ${reached ? "" : "lock"}" ${reached ? `onclick="openLib(${item.id})"` : "disabled"}>
      ${S.stars[item.id] ? "★ " : ""}${esc(item.t)}<br><small>Ch ${item.ch + 1}. ${esc(CHAPTERS[item.ch])}${reached ? "" : " · not unlocked yet"}</small></button>`;
  }).join("") : '<p class="muted">No matching topics. Start a lesson or change the search.</p>';
  renderGlossary(query);
}
function renderGlossary(query = "") {
  const entries = Object.entries(window.AIDM_GLOSSARY).filter(([term, definition]) =>
    !query || `${term} ${definition}`.toLowerCase().includes(query));
  $("glossary").innerHTML = entries.length ? entries.map(([term, definition]) =>
    `<details class="lib-item"><summary><strong>${esc(term)}</strong></summary><p>${esc(definition)}</p></details>`
  ).join("") : '<p class="muted">No glossary terms match this search.</p>';
}
function openLib(id) {
  $("libView").innerHTML = card(ITEMS[id], "lesson", "library");
  $("libView").scrollIntoView({ behavior: "smooth" });
}
function renderSettings() {
  $("order").value = S.settings.order;
  $("path").value = S.settings.path;
  $("recap").checked = S.settings.recap;
  $("remTime").value = S.settings.remTime || "09:00";
  $("notifInfo").textContent = S.settings.notify ? "App notification is on." : "";
  $("exportBtn").disabled = storageBlocked;
  $("contentNote").textContent = `There are ${ITEMS.length} topics in ${CHAPTERS.length} chapters. ${window.AIDM_CONTENT_META.sourceNote} ${window.AIDM_CONTENT_META.editorialNote} Scenarios are realistic composites, not real client cases; numbers are illustrative.`;
}
function render() {
  renderLearn();
  renderProgress();
  renderLibrary();
  renderSettings();
  if (loadWarning) status(loadWarning);
}

function showTab(button) {
  document.querySelectorAll('[role="tab"]').forEach(tab => {
    const active = tab === button;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  document.querySelectorAll("main>section").forEach(section => {
    const active = section.id === button.getAttribute("aria-controls");
    section.classList.toggle("hidden", !active);
    section.hidden = !active;
  });
  render();
}

const placement = { questions: [], index: 0, score: 0, answered: false, recommended: "foundations" };
function startPlacement() {
  const representativeChapters = [1, 3, 4, 8, 11];
  placement.questions = representativeChapters.map(chapter => ITEMS.find(item => item.ch === chapter)).filter(Boolean);
  placement.index = 0;
  placement.score = 0;
  placement.answered = false;
  $("placementDialog").showModal();
  showPlacementQuestion();
}
function showPlacementQuestion() {
  const item = placement.questions[placement.index];
  if (!item) {
    placement.recommended = placement.score <= 1 ? "foundations" : placement.score <= 3 ? "rag" : "production";
    const path = PATHS[placement.recommended].name;
    $("placementProgress").textContent = `Placement result: ${placement.score} of ${placement.questions.length} correct.`;
    $("placementQuestion").innerHTML = `<p>Suggested starting path: <strong>${esc(path)}</strong>.</p>
      <p class="muted">This is a starting point, not a qualification. You can change paths at any time.</p>`;
    $("placementNext").textContent = "Use suggested path";
    $("placementNext").disabled = false;
    placement.answered = "finished";
    return;
  }
  const quiz = AIDMCore.quizFor(ITEMS, item);
  const group = `placement-${placement.index}`;
  $("placementProgress").textContent = `Question ${placement.index + 1} of ${placement.questions.length}`;
  $("placementQuestion").innerHTML = `<h3>${esc(item.t)}</h3><fieldset class="quiz"><legend>${esc(quiz.question)}</legend>
    ${quiz.options.map((option, index) => `<label class="quiz-option"><input type="radio" name="${group}" value="${index}"><span>${esc(option)}</span></label>`).join("")}</fieldset>`;
  $("placementFeedback").textContent = "";
  $("placementNext").textContent = "Check answer";
  $("placementNext").disabled = true;
  placement.answered = false;
  $("placementQuestion").querySelectorAll("input").forEach(input => {
    input.addEventListener("change", () => { $("placementNext").disabled = false; });
  });
}
function placementNext() {
  if (placement.answered === "finished") {
    S.settings.path = placement.recommended;
    save();
    $("placementDialog").close();
    render();
    return;
  }
  if (!placement.answered) {
    const item = placement.questions[placement.index];
    const quiz = AIDMCore.quizFor(ITEMS, item);
    const selected = $("placementQuestion").querySelector("input:checked");
    if (!selected) return;
    const correct = Number(selected.value) === quiz.answerIndex;
    if (correct) {
      placement.score++;
      S.learned[item.id] = S.learned[item.id] || { at: new Date().toISOString() };
      S.reviews[item.id] = AIDMCore.nextReview(null, true, today());
    }
    $("placementQuestion").querySelectorAll("input").forEach(input => { input.disabled = true; });
    $("placementFeedback").textContent = correct ? "Correct. This topic has been marked as reached." : "Not correct yet. You can study this topic in the recommended path.";
    $("placementNext").textContent = placement.index === placement.questions.length - 1 ? "See recommendation" : "Next";
    placement.answered = true;
    save();
    return;
  }
  placement.index++;
  placement.answered = false;
  showPlacementQuestion();
}

function downloadSummary() {
  const reached = ITEMS.filter(item => S.learned[item.id]).length;
  const mastered = ITEMS.filter(item => isMastered(item.id)).length;
  const due = dueReviews().length;
  const lines = [
    "AI Delivery Manager Academy - Learning summary",
    `Generated: ${today()}`,
    `Selected path: ${currentPath().name}`,
    `Topics reached: ${reached}/${ITEMS.length}`,
    `Topics with a correct knowledge check: ${mastered}/${ITEMS.length}`,
    `Reviews due today: ${due}`,
    "",
    "Chapter milestones:"
  ];
  CHAPTERS.forEach((chapter, index) => {
    const items = ITEMS.filter(item => item.ch === index);
    const passed = items.filter(item => isMastered(item.id)).length;
    lines.push(`${passed === items.length ? "[x]" : "[ ]"} ${chapter} (${passed}/${items.length})`);
  });
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `aidm-learning-summary-${today()}.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function validImport(data) {
  return AIDMCore.validProgress(data, ITEMS.length, Object.keys(PATHS));
}
function mergeImported(data) {
  const state = {
    ...clone(DEF),
    ...data,
    reviews: data.reviews || {},
    notes: data.notes || {},
    history: data.history || [],
    settings: { ...DEF.settings, ...(data.settings || {}), v: SETV }
  };
  if ((!data.settings || data.settings.v !== SETV) && !data.reviews) {
    Object.keys(state.learned).forEach(id => {
      state.reviews[id] = {
        step: 0,
        due: AIDMCore.addDays(today(), Number(id) % 14),
        attempts: 0,
        lastCorrect: false
      };
    });
  }
  return state;
}
function icsEscape(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
document.querySelectorAll('[role="tab"]').forEach((button, index, buttons) => {
  button.id = `tab-${button.dataset.tab}-button`;
  button.tabIndex = index === 0 ? 0 : -1;
  button.addEventListener("click", () => showTab(button));
  button.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const target = buttons[(index + offset + buttons.length) % buttons.length];
    target.focus();
    showTab(target);
  });
});
Object.entries(PATHS).forEach(([key, path]) => {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = path.name;
  $("path").append(option);
});
$("startBtn").onclick = start;
$("search").oninput = renderLibrary;
$("onlyStar").onchange = renderLibrary;
$("showLocked").onchange = renderLibrary;
$("order").onchange = event => {
  S.settings.order = event.target.value;
  S.order = null;
  save();
  render();
};
$("path").onchange = event => {
  S.settings.path = event.target.value;
  save();
  render();
};
$("recap").onchange = event => { S.settings.recap = event.target.checked; save(); };
$("resetBtn").onclick = () => {
  if (confirm("Reset all progress? This cannot be undone.")) {
    const settings = S.settings;
    storageBlocked = false;
    loadWarning = "";
    S = { ...clone(DEF), settings: { ...DEF.settings, ...settings, v: SETV } };
    save();
    render();
  }
};
$("exportBtn").onclick = () => {
  const data = JSON.stringify({ ...S, exportVersion: 2 }, null, 2);
  const url = URL.createObjectURL(new Blob([data], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `aidm-progress-${today()}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$("importBtn").onclick = () => $("importFile").click();
$("importFile").onchange = async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    if (!validImport(imported)) throw new Error("The file does not match the supported progress format.");
    const next = mergeImported(imported);
    localStorage.setItem(KEY, JSON.stringify(next));
    S = next;
    storageBlocked = false;
    loadWarning = "";
    render();
    status("Progress imported successfully.");
  } catch (error) {
    console.error("Progress import failed.", error);
    const detail = error instanceof Error ? error.message : "the file could not be read";
    status(`Import failed: ${detail} Existing progress was not changed.`);
  } finally {
    event.target.value = "";
  }
};
$("summaryBtn").onclick = downloadSummary;
$("placementBtn").onclick = startPlacement;
$("placementNext").onclick = placementNext;
$("placementClose").onclick = () => $("placementDialog").close();
$("placementDialog").addEventListener("click", event => {
  if (event.target === $("placementDialog")) $("placementDialog").close();
});
$("icsBtn").onclick = () => {
  const time = $("remTime").value || "09:00";
  S.settings.remTime = time;
  save();
  const [hour, minute] = time.split(":");
  const days = $("remDays").value.split(",");
  const date = AIDMCore.nextSelectedDay(days);
  const start = fmt(date).replace(/-/g, "") + "T" + hour + minute + "00";
  const url = location.href.split("#")[0].split("?")[0];
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AIDM Academy//EN", "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
    "UID:aidm-academy-" + Date.now() + "@reminder",
    "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
    "DTSTART:" + start, "DURATION:PT6M", "RRULE:FREQ=WEEKLY;BYDAY=" + days.join(","),
    "SUMMARY:AI Delivery Manager Academy (6 min)",
    "DESCRIPTION:" + icsEscape("Open the app and press Start: " + url),
    "URL:" + icsEscape(url), "TRANSP:TRANSPARENT", "BEGIN:VALARM", "ACTION:DISPLAY",
    "DESCRIPTION:Your AI delivery topics are ready", "TRIGGER:PT0M", "END:VALARM", "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  const blobUrl = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "aidm-academy-reminder.ics";
  link.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  $("notifInfo").textContent = "Open the downloaded file to add it to your calendar.";
};
$("notifBtn").onclick = async () => {
  if (!("Notification" in window)) {
    $("notifInfo").textContent = "This browser does not support notifications. Use the calendar reminder.";
    return;
  }
  const permission = await Notification.requestPermission();
  S.settings.notify = permission === "granted";
  save();
  $("notifInfo").textContent = permission === "granted" ?
    "On. The app can nudge you when opened; use the calendar reminder for alerts while it is closed." :
    "Notifications are blocked in your browser settings.";
};
function nudge(registration) {
  if (S.settings.notify && window.Notification && Notification.permission === "granted" &&
      (remaining().length || dueReviews().length) &&
      !(S.history[0] && S.history[0].date === today())) {
    registration.showNotification("AI Delivery Manager Academy", {
      body: "A short lesson or spaced review is waiting.",
      icon: "icon-192.png",
      tag: "aidm"
    });
  }
}
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js")
    .then(() => navigator.serviceWorker.ready)
    .then(nudge)
    .catch(error => {
      console.error("Service worker registration failed.", error);
      status("Offline support could not be enabled. The app remains usable online.");
    });
}
render();
