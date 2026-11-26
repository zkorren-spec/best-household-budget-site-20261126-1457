// Hash router + boot for The Marlowe Budget Book.
// Routes: #/dashboard, #/transactions, #/envelopes, #/bills, #/goals.
// The router re-renders on every hash change so the back button, bookmarks
// and the nav links all land on the same real pages.

import { store } from "./state.js";
import {
  renderDashboard,
  renderTransactions,
  renderEnvelopes,
  renderBills,
  renderGoals,
} from "./views.js";

const ROUTES = {
  "/dashboard": renderDashboard,
  "/transactions": renderTransactions,
  "/envelopes": renderEnvelopes,
  "/bills": renderBills,
  "/goals": renderGoals,
};

function currentRoute() {
  const hash = window.location.hash || "#/dashboard";
  const path = hash.slice(1);
  return ROUTES[path] ? path : "/dashboard";
}

function render() {
  const view = document.getElementById("view");
  const path = currentRoute();
  view.innerHTML = "";
  ROUTES[path](view, store);
  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + path);
  });
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
