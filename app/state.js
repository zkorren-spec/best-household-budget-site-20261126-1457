// State: seeded from data.js, kept in localStorage so edits survive reload.
// Everything the pages show is derived here — no number is typed twice.
import { INCOME, ENVELOPES, TRANSACTIONS, BILLS, GOALS, MONTHS } from "./data.js";

const KEY = "marlowe-budget-v1";

export function fmt(n) {
  return "$" + n.toLocaleString("en-US");
}

export function shortDate(iso) {
  const parts = iso.split("-").map(Number);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[parts[1] - 1] + " " + parts[2];
}

function seed() {
  return {
    income: INCOME.map((x) => ({ ...x })),
    envelopes: ENVELOPES.map((x) => ({ ...x })),
    transactions: TRANSACTIONS.map((x) => ({ ...x })),
    bills: BILLS.map((x) => ({ ...x })),
    goals: GOALS.map((x) => ({ ...x })),
    months: MONTHS.map((x) => ({ ...x })),
  };
}

function load() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {
    // Corrupt or unavailable storage: fall through to a fresh seed.
  }
  const fresh = seed();
  save(fresh);
  return fresh;
}

function save(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch (_) {
    // Private mode or full storage: the site still works in memory.
  }
}

export function totals(state) {
  const income = state.income.reduce((s, x) => s + x.amount, 0);
  const allocated = state.envelopes.reduce((s, x) => s + x.allocated, 0);
  const spent = state.envelopes.reduce((s, x) => s + x.spent, 0);
  const savings = state.envelopes.find((e) => e.id === "savings");
  return { income, allocated, spent, left: income - spent, saved: savings ? savings.spent : 0 };
}

export const store = {
  state: load(),
  totals() {
    return totals(this.state);
  },
  save() {
    save(this.state);
  },
  addTransaction(t) {
    const amount = Number(t.amount);
    if (!t.description || !Number.isFinite(amount) || amount <= 0) return false;
    const env = this.state.envelopes.find((e) => e.name === t.category);
    if (!env) return false;
    this.state.transactions.push({ date: t.date, description: t.description, category: t.category, amount });
    env.spent += amount;
    this.save();
    return true;
  },
  adjustEnvelope(id, delta) {
    const env = this.state.envelopes.find((e) => e.id === id);
    if (!env) return;
    env.spent = Math.max(0, env.spent + delta);
    this.save();
  },
  markBillPaid(id) {
    const bill = this.state.bills.find((b) => b.id === id);
    if (!bill || bill.status === "paid") return;
    bill.status = "paid";
    const env = this.state.envelopes.find((e) => e.name === bill.envelope);
    if (env) env.spent += bill.amount;
    this.state.transactions.push({ date: bill.due, description: bill.name, category: bill.envelope, amount: bill.amount });
    this.save();
  },
  addGoal(name, target) {
    const t = Number(target);
    if (!name || !Number.isFinite(t) || t <= 0) return false;
    this.state.goals.push({ id: "goal-" + Date.now(), name, saved: 0, target: t, note: "Added by the Marlowes.", deadline: "" });
    this.save();
    return true;
  },
};
