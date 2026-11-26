// Page renderers. Each one takes the view element and the store,
// renders real numbers derived from the seed, then wires its controls.
import { fmt, shortDate } from "./state.js";
import { donut, monthBars, netWorthLine, goalRing } from "./charts.js";

function statCard(label, value, note) {
  return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></div>`;
}

function txRow(t) {
  return `<tr><td>${shortDate(t.date)}</td><td>${t.description}</td><td>${t.category}</td><td class="num">${fmt(t.amount)}</td></tr>`;
}

function txTable(list) {
  return `<table class="tx-table"><thead><tr><th>Date</th><th>Description</th><th>Envelope</th><th class="num">Amount</th></tr></thead><tbody>${list.map(txRow).join("")}</tbody></table>`;
}

export function renderDashboard(view, store) {
  const s = store.state;
  const t = store.totals();
  const upcoming = s.bills.filter((b) => b.status !== "paid").slice(0, 3);
  const recent = [...s.transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  view.innerHTML = `
  <section class="page-head">
    <h2>November at a glance</h2>
    <p class="lede">Income is spoken for before it arrives. ${fmt(t.left)} of the ${fmt(t.income)} is still unspent, and the savings transfer already went out on the 1st.</p>
  </section>
  <section class="stats">
    ${statCard("Income", fmt(t.income), "3 paydays in November")}
    ${statCard("Spent so far", fmt(t.spent), "of " + fmt(t.allocated) + " assigned")}
    ${statCard("Saved", fmt(t.saved), "auto-transfer, 1 Nov")}
    ${statCard("Left to spend", fmt(t.left), "across 12 envelopes")}
  </section>
  <section class="grid-2">
    <div class="card"><h3>Where the money went</h3>${donut(s.envelopes)}</div>
    <div class="card"><h3>Spending by month</h3>${monthBars(s.months)}</div>
  </section>
  <section class="card">
    <h3>Coming up</h3>
    <ul class="bill-strip">${upcoming.map((b) => `<li><span>${b.name}</span><span>${fmt(b.amount)} · due ${shortDate(b.due)}</span></li>`).join("")}</ul>
    <p><a href="#/bills">See all bills →</a></p>
  </section>
  <section class="card">
    <h3>Latest transactions</h3>
    ${txTable(recent)}
    <p><a href="#/transactions">See all 37 transactions →</a></p>
  </section>`;
}

export function renderTransactions(view, store) {
  const s = store.state;
  const t = store.totals();
  const cats = ["all", ...new Set(s.transactions.map((x) => x.category))];
  view.innerHTML = `
  <section class="page-head">
    <h2>Transactions</h2>
    <p class="lede">${s.transactions.length} entries, ${fmt(t.spent)} in total — every one of them lands in an envelope.</p>
  </section>
  <section class="card">
    <label class="filter">Filter by envelope
      <select id="tx-filter">${cats.map((c) => `<option value="${c}">${c === "all" ? "All envelopes" : c}</option>`).join("")}</select>
    </label>
    <div id="tx-list">${txTable([...s.transactions].sort((a, b) => b.date.localeCompare(a.date)))}</div>
  </section>
  <section class="card">
    <h3>Add a transaction</h3>
    <form id="tx-form" class="form">
      <label>Date <input name="date" type="date" value="2026-11-26" required></label>
      <label>Description <input name="description" required maxlength="80" placeholder="e.g. Market — Green Grocer"></label>
      <label>Envelope <select name="category">${s.envelopes.map((e) => `<option value="${e.name}">${e.name}</option>`).join("")}</select></label>
      <label>Amount ($) <input name="amount" type="number" min="1" step="0.01" required placeholder="25"></label>
      <button type="submit" class="btn">Add transaction</button>
    </form>
  </section>`;
  view.querySelector("#tx-filter").addEventListener("change", (e) => {
    const cat = e.target.value;
    const list = [...s.transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .filter((x) => cat === "all" || x.category === cat);
    view.querySelector("#tx-list").innerHTML = txTable(list);
  });
  view.querySelector("#tx-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const ok = store.addTransaction({
      date: String(data.get("date")),
      description: String(data.get("description")),
      category: String(data.get("category")),
      amount: String(data.get("amount")),
    });
    if (ok) renderTransactions(view, store);
  });
}

function envCard(e) {
  const left = e.allocated - e.spent;
  const pct = Math.min(100, Math.round((e.spent / e.allocated) * 100));
  const over = left < 0;
  return `<article class="env-card">
    <h3>${e.name}</h3>
    <p class="env-note">${e.note}</p>
    <div class="env-bar" role="img" aria-label="${e.name}: $${e.spent} of $${e.allocated} spent"><span style="width:${pct}%"></span></div>
    <p class="env-nums"><span>Spent <b>${fmt(e.spent)}</b></span><span>Left <b class="${over ? "over" : ""}">${fmt(left)}</b></span><span class="env-pct">${pct}%</span></p>
    <div class="env-actions">
      <button type="button" data-env="${e.id}" data-delta="-5" aria-label="Record a $5 refund in ${e.name}">− $5</button>
      <button type="button" data-env="${e.id}" data-delta="5" aria-label="Record $5 spent in ${e.name}">+ $5</button>
    </div>
  </article>`;
}

export function renderEnvelopes(view, store) {
  const s = store.state;
  const t = store.totals();
  view.innerHTML = `
  <section class="page-head">
    <h2>Envelopes</h2>
    <p class="lede">Twelve envelopes hold the whole ${fmt(t.income)}. ${fmt(t.left)} is still in them — tap + $5 when money leaves an envelope, − $5 when it comes back.</p>
  </section>
  <section class="env-grid">${s.envelopes.map(envCard).join("")}</section>`;
  view.querySelectorAll("[data-env]").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.adjustEnvelope(btn.dataset.env, Number(btn.dataset.delta));
      renderEnvelopes(view, store);
    });
  });
}

export function renderBills(view, store) {
  const s = store.state;
  const paid = s.bills.filter((b) => b.status === "paid");
  const unpaid = s.bills.filter((b) => b.status !== "paid");
  const paidSum = paid.reduce((sum, b) => sum + b.amount, 0);
  const unpaidSum = unpaid.reduce((sum, b) => sum + b.amount, 0);
  view.innerHTML = `
  <section class="page-head">
    <h2>Bills</h2>
    <p class="lede">Eight bills this month, ${fmt(paidSum + unpaidSum)} in total. ${fmt(paidSum)} is paid; ${fmt(unpaidSum)} is still waiting — the gym and the car insurance are due before the month ends.</p>
  </section>
  <section class="card">
    <table class="tx-table bill-table">
      <thead><tr><th>Bill</th><th>Due</th><th>Envelope</th><th class="num">Amount</th><th>Status</th><th></th></tr></thead>
      <tbody>${s.bills.map((b) => `<tr>
        <td>${b.name}</td><td>${shortDate(b.due)}</td><td>${b.envelope}</td><td class="num">${fmt(b.amount)}</td>
        <td><span class="badge ${b.status}">${b.status === "paid" ? "Paid" : b.status === "due" ? "Due soon" : "Upcoming"}</span></td>
        <td>${b.status === "paid" ? "" : `<button type="button" class="btn" data-bill="${b.id}">Mark paid</button>`}</td>
      </tr>`).join("")}</tbody>
    </table>
  </section>`;
  view.querySelectorAll("[data-bill]").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.markBillPaid(btn.dataset.bill);
      renderBills(view, store);
    });
  });
}

export function renderGoals(view, store) {
  const s = store.state;
  view.innerHTML = `
  <section class="page-head">
    <h2>Goals</h2>
    <p class="lede">Four things the Marlowes are saving toward. The emergency fund is closest; the kitchen refresh is the long game.</p>
  </section>
  <section class="card">
    <h3>Net worth</h3>
    ${netWorthLine(s.months)}
  </section>
  <section class="goal-grid">${s.goals.map((g) => `<article class="card goal-card">
    <h3>${g.name}</h3>
    <p class="goal-note">${g.note}</p>
    ${goalRing(g)}
    <p class="goal-deadline">${g.deadline ? "Target: " + g.deadline : "No deadline set"}</p>
  </article>`).join("")}</section>
  <section class="card">
    <h3>Start a new goal</h3>
    <form id="goal-form" class="form">
      <label>Goal name <input name="name" required maxlength="60" placeholder="e.g. New washing machine"></label>
      <label>Target amount ($) <input name="target" type="number" min="1" required placeholder="500"></label>
      <button type="submit" class="btn">Add goal</button>
    </form>
  </section>`;
  view.querySelector("#goal-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    if (store.addGoal(String(data.get("name")), String(data.get("target")))) renderGoals(view, store);
  });
}
