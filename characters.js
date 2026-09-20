const TIERS = ["S", "A", "B", "C", "D", "F"];
const SHOWS = ["original", "bib", "family", "crib"];
const ROLES = ["templeton", "babycorp", "friend", "antagonist", "animal"];
const SHOW_LABELS = { original: "Bossy Baby", bib: "Back in Business", family: "Family Business", crib: "Back in the Crib" };
const SHOW_SHORT = { original: "BB", bib: "BIB", family: "FB", crib: "BIC" };
const ROLE_LABELS = { templeton: "Templeton", babycorp: "Baby Corp", friend: "Friends & family", antagonist: "Antagonist", animal: "Animal / group" };
const KEYS = { ranks: "boss-baby-tier-ranks-v1", order: "boss-baby-tier-order-v1", custom: "boss-baby-tier-custom-v1", view: "boss-baby-tier-view-v1" };

// Named, credited, recurring and collective entries researched across the four requested titles.
const roster = new Map();
function add(show, role, names) {
  names.forEach((name) => {
    const key = name.toLowerCase();
    if (!roster.has(key)) roster.set(key, { id: `bb-${slug(name)}`, name, role, shows: [] });
    const entry = roster.get(key);
    if (!entry.shows.includes(show)) entry.shows.push(show);
  });
}
function slug(value) { return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

add("original", "templeton", ["Boss Baby (Theodore Templeton Jr.)", "Tim Templeton", "Ted Templeton Sr.", "Janice Templeton"]);
add("original", "babycorp", ["Big Boss Baby", "Jimbo", "Staci", "Triplets", "Mega Fat CEO Baby"]);
add("original", "antagonist", ["Francis E. Francis", "Eugene Francis"]);
add("original", "friend", ["Wizzie"]);

add("family", "templeton", ["Boss Baby (Theodore Templeton Jr.)", "Tim Templeton", "Ted Templeton Sr.", "Janice Templeton", "Carol Templeton", "Tina Templeton", "Tabitha Templeton"]);
add("family", "babycorp", ["Jimbo", "Triplets", "Glue Baby", "Lead Baby Ninja", "Ninja Babies", "Baby Bouncer", "Little Bo Peep Baby"]);
add("family", "antagonist", ["Dr. Erwin Armstrong", "Nathan Pickles", "Meghan", "Creepy Girl", "No Girl"]);
add("family", "friend", ["Wizzie", "Story Bear Connie", "Dr. Tiffany Hamilton", "Box Kid", "Time Out Kid", "Acorn Center Computer", "Movie Patron", "Tim Templeton", "Pageant Mom 1", "Pageant Mom 2", "Dreidel Kid"]);

add("bib", "templeton", ["Boss Baby (Theodore Templeton Jr.)", "Tim Templeton", "Ted Templeton Sr.", "Janice Templeton", "Gigi Templeton", "Big Ed"]);
add("bib", "babycorp", ["Jimbo", "Staci", "Triplets", "Mega Fat CEO Baby", "Magnus", "Hendershot", "Scooter Buskie", "Amal", "Buddy from HR", "R&D Baby Simmons", "Marsha Krinkle", "Security Baby Katja", "Chip", "Junior Fancy", "Pull-String CEO Baby", "Gina Namashita", "Tina Namashita", "Hermano Menor Director Baby", "Rattleshake CEO Baby", "Scary Sweary CEO Baby", "Turtleneck Superstar", "Miss Multi-Multitask CEO Baby"]);
add("bib", "friend", ["Danny Petrosky", "Marisol Lopez Lugo", "Bug the Pug", "Officer Doug Fardy", "Mayor Freeman", "Joy Freeman", "Pearl Freeman", "Mr. Buskie", "Mrs. Buskie", "Cat Cop", "Donald", "Frankie", "Guitar Baby", "Jarreau McIntosh", "Marcos Lightspeed", "Thomas Kulkelka", "Sandy Burgess", "Ms. Hansen-Jansen", "Ms. Summer", "Midge Marksberry", "Hae-Sook", "Carlisle", "Chito", "Dakota", "Debbie", "Dondre", "Georgo", "Roosevelt", "Taffeta", "Vedant"]);
add("bib", "antagonist", ["Bootsy Calico", "Wendi McCraken", "Frederic Estes", "Happy Sedengry", "Maria Maria", "Pyg", "Tam", "OCB", "Wagby", "Travis Le Duque", "Frodarg", "Dr. Kevin, MD"]);
add("bib", "animal", ["Forever Puppy", "Japanese Toy Swing"]);

add("crib", "templeton", ["Boss Baby (Theodore Templeton Jr.)", "Tim Templeton", "Carol Templeton", "Tina Templeton", "Tabitha Templeton"]);
add("crib", "babycorp", ["JJ", "Pip", "Dez", "Hendershot", "Amal", "Buddy from HR", "R&D Baby Simmons", "Marsha Krinkle", "Security Baby Katja", "Chip", "I.T. Baby Cammy", "Junior Fancy Jr.", "Nannycam No-Filter CEO Baby", "Bad Idea Baby", "Jackie Business", "Board Baby Agnes", "Banker Baby Benny", "Criminal Baby Paula", "Criminal Baby Mateo", "Worker Baby Aoife", "H. Phyllis Sky-Larkin", "UBO"]);
add("crib", "friend", ["Yvette", "Melissa", "Uncle Benji Guerrero", "Lily Guerrero", "Peg", "Yaya", "Harve", "Hilde", "Ace", "Stella", "Chet", "Tyler", "Dr. Cherylynn", "Officer Pam", "Ranger Safety Binkerton", "Sheriff Potty Pardner", "Scooter Buskie", "Board Member Joaquin", "Board Member Bradley", "Female FBI Agent Brown", "Agent Brown", "Other Agent Brown", "Curtis 'Lumpy' the Park Duck", "Changing Table Ian", "Random Onlooker Ian"]);
add("crib", "antagonist", ["Uncuddleables", "Mia", "Antonio", "Austin", "Bounce House Bruiser", "The Field Team", "Five Percenters", "The Luxes", "Crispin Biscuits", "Russ Tisdale", "The Shrinkies", "Dr. Thubberirhd", "Aubrey", "Lil Bit"]);
add("crib", "animal", ["Precious Templeton", "Beefy", "Mr. Tigglesnooks", "Yarnball", "Referee Puppy"]);

const base = [...roster.values()].sort((a, b) => a.name.localeCompare(b.name));

function readJson(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
const state = { base, custom: readJson(KEYS.custom, []), ranks: readJson(KEYS.ranks, {}), order: readJson(KEYS.order, []), draggedId: null };
const els = {
  tiers: document.querySelector("#tiers"), template: document.querySelector("#cardTemplate"), search: document.querySelector("#searchInput"),
  shows: [...document.querySelectorAll(".continuity-filter input")], roles: [...document.querySelectorAll(".role-filter input")],
  visible: document.querySelector("#visibleCount"), ranked: document.querySelector("#rankedCount"), catalogue: document.querySelector("#catalogueCount"), status: document.querySelector("#saveStatus"),
  save: document.querySelector("#saveLocal"), export: document.querySelector("#exportList"), importer: document.querySelector("#importList"), file: document.querySelector("#importFile"), reset: document.querySelector("#resetRanks"),
  add: document.querySelector("#addCharacter"), dialog: document.querySelector("#addDialog"), form: document.querySelector("#addCharacterForm"), addError: document.querySelector("#addError")
};
function allCharacters() { return [...state.base, ...state.custom]; }
function save() { localStorage.setItem(KEYS.ranks, JSON.stringify(state.ranks)); localStorage.setItem(KEYS.order, JSON.stringify(state.order)); localStorage.setItem(KEYS.custom, JSON.stringify(state.custom)); }
function saveView() { localStorage.setItem(KEYS.view, JSON.stringify({ shows: els.shows.filter((b) => b.checked).map((b) => b.value), roles: els.roles.filter((b) => b.checked).map((b) => b.value), search: els.search.value })); }
function restoreView() { const view = readJson(KEYS.view, null); if (!view) return; els.shows.forEach((box) => { box.checked = Array.isArray(view.shows) && view.shows.includes(box.value); }); els.roles.forEach((box) => { box.checked = Array.isArray(view.roles) && view.roles.includes(box.value); }); els.search.value = typeof view.search === "string" ? view.search : ""; }
function makeRows() { TIERS.forEach((tier) => { const row = document.createElement("section"); row.className = "tier-row"; row.innerHTML = `<div class="tier-label">${tier}</div><div class="dropzone" data-tier="${tier}" aria-label="${tier} tier"></div>`; els.tiers.append(row); }); }
function firstLetters(name) { return name.replace(/\([^)]*\)/g, "").split(/[\s'.-]+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase(); }
function makeCard(character) {
  const card = els.template.content.firstElementChild.cloneNode(true); card.dataset.id = character.id; card.dataset.role = character.role; if (character.custom) card.dataset.custom = "true";
  card.querySelector(".card-monogram").textContent = firstLetters(character.name); card.querySelector("strong").textContent = character.name;
  card.querySelector(".card-meta").textContent = character.shows.map((show) => SHOW_SHORT[show]).join(" · ");
  card.title = `${ROLE_LABELS[character.role]} — ${character.shows.map((show) => SHOW_LABELS[show]).join(", ")}`;
  card.querySelector(".remove-character").addEventListener("click", () => { state.custom = state.custom.filter((entry) => entry.id !== character.id); state.order = state.order.filter((id) => id !== character.id); delete state.ranks[character.id]; save(); render(); });
  card.addEventListener("dragstart", () => { state.draggedId = character.id; card.classList.add("dragging"); }); card.addEventListener("dragend", () => { state.draggedId = null; card.classList.remove("dragging"); }); return card;
}
function setRank(id, tier, targetId = null, after = false) { state.order = state.order.filter((entry) => entry !== id); if (tier === "unranked") delete state.ranks[id]; else { state.ranks[id] = tier; const index = targetId && targetId !== id ? state.order.indexOf(targetId) : -1; if (index >= 0) state.order.splice(index + Number(after), 0, id); else state.order.splice(state.order.findLastIndex((entry) => state.ranks[entry] === tier) + 1, 0, id); } save(); render(); }
function render() {
  document.querySelectorAll(".dropzone").forEach((zone) => { zone.innerHTML = ""; }); const fragments = Object.fromEntries(["unranked", ...TIERS].map((tier) => [tier, document.createDocumentFragment()]));
  const ordering = new Map(state.order.map((id, index) => [id, index])); const selectedShows = new Set(els.shows.filter((box) => box.checked).map((box) => box.value)); const selectedRoles = new Set(els.roles.filter((box) => box.checked).map((box) => box.value)); const search = els.search.value.trim().toLowerCase(); let visible = 0;
  allCharacters().sort((a, b) => (ordering.get(a.id) ?? Infinity) - (ordering.get(b.id) ?? Infinity) || a.name.localeCompare(b.name)).forEach((character) => { const card = makeCard(character); const matches = character.shows.some((show) => selectedShows.has(show)) && selectedRoles.has(character.role) && (!search || character.name.toLowerCase().includes(search)); card.hidden = !matches; if (matches) visible += 1; fragments[state.ranks[character.id] || "unranked"].append(card); });
  Object.entries(fragments).forEach(([tier, fragment]) => document.querySelector(`[data-tier="${tier}"]`).append(fragment)); els.visible.textContent = `${visible} shown`; els.ranked.textContent = `${Object.keys(state.ranks).length} ranked`; els.catalogue.textContent = `${allCharacters().length} directory entries`;
}
function setupDropzones() { document.addEventListener("dragover", (event) => { const zone = event.target.closest(".dropzone"); if (!zone || !state.draggedId) return; event.preventDefault(); zone.classList.add("drag-over"); document.querySelectorAll(".drop-before,.drop-after").forEach((card) => card.classList.remove("drop-before", "drop-after")); const target = event.target.closest(".character-card:not([hidden])"); if (target && target.dataset.id !== state.draggedId && zone.dataset.tier !== "unranked") target.classList.add(event.clientX < target.getBoundingClientRect().left + target.offsetWidth / 2 ? "drop-before" : "drop-after"); }); document.addEventListener("dragleave", (event) => event.target.closest(".dropzone")?.classList.remove("drag-over")); document.addEventListener("drop", (event) => { const zone = event.target.closest(".dropzone"); if (!zone || !state.draggedId) return; event.preventDefault(); zone.classList.remove("drag-over"); const target = event.target.closest(".character-card:not([hidden])"); const after = Boolean(target?.classList.contains("drop-after")); document.querySelectorAll(".drop-before,.drop-after").forEach((card) => card.classList.remove("drop-before", "drop-after")); setRank(state.draggedId, zone.dataset.tier, target?.dataset.id, after); }); }
function exportList() { const data = { format: "boss-baby-character-tier-list", version: 1, ranks: state.ranks, order: state.order, custom: state.custom, shows: els.shows.filter((box) => box.checked).map((box) => box.value), roles: els.roles.filter((box) => box.checked).map((box) => box.value), search: els.search.value }; const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = "boss-baby-characters.bblist"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); els.status.textContent = "Tier list exported."; }
async function importList(file) { if (!file) return; try { if (file.size > 2_000_000) throw new Error("That save file is too large."); const data = JSON.parse(await file.text()); if (data?.format !== "boss-baby-character-tier-list" || data.version !== 1 || typeof data.ranks !== "object" || !Array.isArray(data.order) || !Array.isArray(data.custom)) throw new Error("This is not a Boss Baby tier-list save."); const ids = new Set([...state.base.map((entry) => entry.id), ...data.custom.map((entry) => entry.id)]); if (Object.entries(data.ranks).some(([id, tier]) => !ids.has(id) || !TIERS.includes(tier))) throw new Error("This save has invalid rankings."); state.ranks = data.ranks; state.order = data.order.filter((id) => ids.has(id)); state.custom = data.custom.filter((entry) => entry?.custom && typeof entry.name === "string" && SHOWS.includes(entry.shows?.[0]) && ROLES.includes(entry.role)); els.shows.forEach((box) => { box.checked = data.shows?.includes(box.value); }); els.roles.forEach((box) => { box.checked = data.roles?.includes(box.value); }); els.search.value = typeof data.search === "string" ? data.search : ""; save(); saveView(); render(); els.status.textContent = "Tier list imported."; } catch (error) { els.status.textContent = error instanceof SyntaxError ? "Could not read that save file." : error.message; } finally { els.file.value = ""; } }
function addCharacter(event) { event.preventDefault(); const data = new FormData(els.form); const name = String(data.get("name") || "").trim(); if (!name) return; if (allCharacters().some((character) => character.name.toLowerCase() === name.toLowerCase())) { els.addError.textContent = "That character is already in the directory."; return; } state.custom.push({ id: `custom-${crypto.randomUUID()}`, name, role: data.get("role"), shows: [data.get("show")], custom: true }); save(); els.dialog.close(); els.form.reset(); els.addError.textContent = ""; els.status.textContent = `${name} added to the directory.`; render(); }
makeRows(); setupDropzones(); restoreView(); render();
els.search.addEventListener("input", () => { saveView(); render(); }); [...els.shows, ...els.roles].forEach((box) => box.addEventListener("change", () => { saveView(); render(); }));
els.save.addEventListener("click", () => { save(); saveView(); els.status.textContent = "Saved in this browser on this device."; }); els.export.addEventListener("click", exportList); els.importer.addEventListener("click", () => els.file.click()); els.file.addEventListener("change", () => importList(els.file.files[0])); els.reset.addEventListener("click", () => { state.ranks = {}; state.order = []; save(); render(); els.status.textContent = "All ranks reset."; }); els.add.addEventListener("click", () => els.dialog.showModal()); document.querySelector("#cancelAdd").addEventListener("click", () => els.dialog.close()); els.form.addEventListener("submit", addCharacter);
