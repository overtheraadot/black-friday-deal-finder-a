// DealScout: the deal finder itself. Two hash routes:
//
//   #/            the deal list, with search and filters
//   #/deal/<id>   one deal, with its verdict and its store link
//
// Filters can also be set from the query string (?q=, ?cat=, ?store=, ?min=,
// ?sort=), so a link can open the board already filtered. Everything runs
// from the site's own files; nothing is fetched from the network.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { CATEGORIES, STORES, deals } from "./deals.js";
import { pctOff, saved } from "./format.js";
import { dealCard, dealPage, listPage, missingPage } from "./views.js";

const app = document.getElementById("app");

function counts() {
  const byCat = CATEGORIES.map((c) => [c, deals.filter((d) => d.category === c).length]);
  const byStore = STORES.map((s) => [s, deals.filter((d) => d.store === s).length]);
  return { categories: byCat, stores: byStore };
}

function stateFromUrl() {
  const params = new URLSearchParams(location.search);
  return {
    q: params.get("q") ?? "",
    cat: params.get("cat") ?? "",
    store: params.get("store") ?? "",
    min: Number(params.get("min") ?? 0) || 0,
    sort: params.get("sort") ?? "off",
  };
}

function applyFilters(state) {
  const q = state.q.trim().toLowerCase();
  const shown = deals.filter((d) => {
    if (state.cat && d.category !== state.cat) return false;
    if (state.store && d.store !== state.store) return false;
    if (pctOff(d) < state.min) return false;
    if (q && !`${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
  const sorters = {
    off: (a, b) => pctOff(b) - pctOff(a) || a.price - b.price,
    save: (a, b) => saved(b) - saved(a),
    price: (a, b) => a.price - b.price,
    title: (a, b) => a.title.localeCompare(b.title),
  };
  return shown.slice().sort(sorters[state.sort] ?? sorters.off);
}

function rerenderGrid(state) {
  const shown = applyFilters(state);
  const grid = app.querySelector(".grid");
  const count = app.querySelector("#count");
  grid.innerHTML = shown.length
    ? shown.map(dealCard).join("\n")
    : '<p class="empty">No deal matches those filters. Loosen the discount or clear the search.</p>';
  count.textContent = `${shown.length} of ${deals.length} deals${state.q || state.cat || state.store || state.min ? " match your filters" : ""}`;
}

function bindControls(state) {
  const q = app.querySelector("#q");
  const cat = app.querySelector("#cat");
  const store = app.querySelector("#store");
  const mind = app.querySelector("#mind");
  const sort = app.querySelector("#sort");
  if (!q) return;
  const update = () => {
    state.q = q.value;
    state.cat = cat.value;
    state.store = store.value;
    state.min = Number(mind.value);
    state.sort = sort.value;
    rerenderGrid(state);
  };
  q.addEventListener("input", update);
  cat.addEventListener("change", update);
  store.addEventListener("change", update);
  mind.addEventListener("change", update);
  sort.addEventListener("change", update);
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | DealScout`;
    app.innerHTML = found ? dealPage(found) : missingPage();
  } else {
    const state = stateFromUrl();
    document.title = "DealScout — Black Friday 2026 deals, checked";
    app.innerHTML = listPage(state, applyFilters(state), counts());
    bindControls(state);
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
