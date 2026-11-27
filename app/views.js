// HTML for the deal-finder pages, built from the deal data in deals.js.
// Every value is escaped before it goes into the page. No network is used:
// the deals, the prices and the check times all live in the site's own files.

import { deals } from "./deals.js";
import { checkedLabel, escape, pctOff, saved, usd, verdictOf } from "./format.js";

export function dealCard(d) {
  const v = verdictOf(d);
  return `<article class="card">
  <div class="card-top"><span class="cat">${escape(d.category)}</span><span class="store">${escape(d.store)}</span></div>
  <h3><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h3>
  <p class="price"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${pctOff(d)}% off</span></p>
  <p class="save">You save ${usd(saved(d))}</p>
  <p class="verdict verdict-${v.tone}">${escape(v.label)}</p>
  <p class="meta">Checked ${checkedLabel(d.checked)}</p>
  <p class="actions"><a class="btn" href="${escape(d.url)}" rel="noopener" target="_blank">View at ${escape(d.store)} &nearr;</a> <a class="btn ghost" href="#/deal/${encodeURIComponent(d.id)}">Details</a></p>
</article>`;
}

export function filterBar(state, counts) {
  const catOpts = ['<option value="">All categories</option>'].concat(
    counts.categories.map(([c, n]) => `<option value="${escape(c)}"${state.cat === c ? " selected" : ""}>${escape(c)} (${n})</option>`),
  );
  const storeOpts = ['<option value="">All stores</option>'].concat(
    counts.stores.map(([s, n]) => `<option value="${escape(s)}"${state.store === s ? " selected" : ""}>${escape(s)} (${n})</option>`),
  );
  return `<section class="filters" aria-label="Search and filter deals">
  <label>Search <input id="q" type="search" placeholder="Try &ldquo;AirPods&rdquo; or &ldquo;TV&rdquo;&hellip;" value="${escape(state.q)}"></label>
  <label>Category <select id="cat">${catOpts.join("")}</select></label>
  <label>Store <select id="store">${storeOpts.join("")}</select></label>
  <label>Min. discount <select id="mind">
    <option value="0"${state.min === 0 ? " selected" : ""}>Any discount</option>
    <option value="25"${state.min === 25 ? " selected" : ""}>25% off or more</option>
    <option value="40"${state.min === 40 ? " selected" : ""}>40% off or more</option>
    <option value="50"${state.min === 50 ? " selected" : ""}>50% off or more</option>
  </select></label>
  <label>Sort <select id="sort">
    <option value="off"${state.sort === "off" ? " selected" : ""}>Biggest discount</option>
    <option value="save"${state.sort === "save" ? " selected" : ""}>Biggest saving ($)</option>
    <option value="price"${state.sort === "price" ? " selected" : ""}>Lowest price</option>
    <option value="title"${state.sort === "title" ? " selected" : ""}>Name A&ndash;Z</option>
  </select></label>
</section>`;
}

export function listPage(state, shown, counts) {
  const total = deals.length;
  const best = deals.reduce((a, b) => (pctOff(b) > pctOff(a) ? b : a), deals[0]);
  const cards = shown.map(dealCard).join("\n");
  return `<section class="hero">
  <h1>Black Friday 2026, checked deal by deal</h1>
  <p class="lede">Every price below was read by the agent on <strong>Friday 27 November 2026</strong> at a named store or in a deals source that names the store. No invented prices, no stale sales — each card says when it was checked and where the price was read.</p>
  <ul class="stats">
    <li><strong>${total}</strong> deals checked</li>
    <li><strong>${counts.stores.length}</strong> stores</li>
    <li><strong>${counts.categories.length}</strong> categories</li>
    <li><strong>${pctOff(best)}% off</strong> deepest cut</li>
  </ul>
</section>
${filterBar(state, counts)}
<p class="count" id="count">${shown.length} of ${total} deals${state.q || state.cat || state.store || state.min ? " match your filters" : ""}</p>
<div class="grid">${cards || '<p class="empty">No deal matches those filters. Loosen the discount or clear the search.</p>'}</div>
<section class="how">
  <h2>How a deal earns its badge</h2>
  <ul>
    <li><span class="verdict verdict-hot">Real deal — new low</span> the lowest price the sources have seen for it.</li>
    <li><span class="verdict verdict-good">Strong deal</span> a deep cut, 40% or more off the usual price.</li>
    <li><span class="verdict verdict-ok">Good deal</span> a real saving, worth buying if you wanted it anyway.</li>
    <li><span class="verdict verdict-flat">Routine sale</span> a small cut — buy it for the product, not the discount.</li>
  </ul>
  <p>Prices move all day on Black Friday. Confirm the price at checkout before you pay.</p>
</section>`;
}

export function dealPage(d) {
  const v = verdictOf(d);
  const same = deals.filter((x) => x.title === d.title && x.id !== d.id);
  const compare = same.length
    ? `<section class="compare"><h2>Same product, other stores</h2><ul>${same
        .map(
          (x) =>
            `<li><strong>${escape(x.store)}</strong> — ${usd(x.price)} <s>${usd(x.was)}</s> (${pctOff(x)}% off) <a href="#/deal/${encodeURIComponent(x.id)}">see deal</a></li>`,
        )
        .join("")}</ul></section>`
    : "";
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top"><span class="cat">${escape(d.category)}</span><span class="store">${escape(d.store)}</span></div>
  <h1>${escape(d.title)}</h1>
  <p class="price big"><strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> <span class="off">${pctOff(d)}% off</span></p>
  <p class="save">You save ${usd(saved(d))} off the usual price of ${usd(d.was)}.</p>
  <p class="verdict verdict-${v.tone}">${escape(v.label)}</p>
  <p class="evidence">${escape(d.evidence)}</p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Price checked</dt><dd>${checkedLabel(d.checked)}</dd>
    <dt>Where the price was read</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p class="actions"><a class="btn big" href="${escape(d.url)}" rel="noopener" target="_blank">Buy it at ${escape(d.store)} &nearr;</a></p>
  <p class="note">The link opens the product search at ${escape(d.store)}. Prices change fast on Black Friday — check the price on the store page before you pay.</p>
</article>
${compare}`;
}

export function missingPage() {
  return `<h1>Deal not found</h1><p>There is no deal at this address. <a href="#/">See all ${deals.length} deals</a>.</p>`;
}
