// Inline SVG charts — no libraries, no network. Pure functions of the data.
const DONUT_COLORS = ["#1f4d2e", "#2e6b3e", "#c77f0a", "#7a9b6d", "#8a6d3b", "#4a7c59", "#b98a2f", "#5b7a8c", "#96613f", "#3f6d4e", "#a8b08a", "#6d8f5a"];

export function donut(envelopes) {
  const total = envelopes.reduce((s, e) => s + e.spent, 0);
  let offset = 25;
  const slices = envelopes.map((e, i) => {
    const frac = total ? e.spent / total : 0;
    const el = `<circle r="15.9155" cx="21" cy="21" fill="transparent" stroke="${DONUT_COLORS[i % DONUT_COLORS.length]}" stroke-width="6" stroke-dasharray="${(frac * 100).toFixed(2)} ${(100 - frac * 100).toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"></circle>`;
    offset -= frac * 100;
    return el;
  }).join("");
  const legend = envelopes.map((e, i) => `<li><span class="dot" style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></span>${e.name} <b>$${e.spent.toLocaleString("en-US")}</b></li>`).join("");
  return `<div class="chart-row"><svg viewBox="0 0 42 42" class="donut" role="img" aria-label="Spending by envelope, total $${total.toLocaleString("en-US")}">${slices}<text x="21" y="20" class="donut-center">$${total.toLocaleString("en-US")}</text><text x="21" y="25" class="donut-sub">spent</text></svg><ul class="legend">${legend}</ul></div>`;
}

export function monthBars(months) {
  const max = Math.max(...months.map((m) => m.spent));
  const bars = months.map((m) => {
    const h = Math.round((m.spent / max) * 120);
    return `<div class="bar-col"><div class="bar" style="height:${h}px" title="${m.label}: $${m.spent}"></div><div class="bar-val">$${m.spent.toLocaleString("en-US")}</div><div class="bar-label">${m.label}</div></div>`;
  }).join("");
  return `<div class="bars">${bars}</div><p class="chart-note">November is the highest month yet — the dentist copay and the field trip landed in the same week.</p>`;
}

// Net-worth line, June → November, with the December target marked.
export function netWorthLine(months) {
  const width = 560;
  const height = 180;
  const pad = 34;
  const values = months.map((m) => m.netWorth);
  const min = Math.min(...values) - 200;
  const max = 10500;
  const x = (i) => pad + (i * (width - pad * 2)) / (months.length - 1);
  const y = (v) => height - pad - ((v - min) / (max - min)) * (height - pad * 2);
  const points = months.map((m, i) => `${x(i).toFixed(1)},${y(m.netWorth).toFixed(1)}`).join(" ");
  const targetY = y(10500);
  const dots = months.map((m, i) => `<circle cx="${x(i)}" cy="${y(m.netWorth)}" r="4" fill="#1f4d2e"><title>${m.label}: $${m.netWorth.toLocaleString("en-US")}</title></circle>`).join("");
  const labels = months.map((m, i) => `<text x="${x(i)}" y="${height - 8}" class="axis-label" text-anchor="middle">${m.label}</text>`).join("");
  return `<svg viewBox="0 0 ${width} ${height}" class="line-chart" role="img" aria-label="Net worth rising from $8,400 in June to $10,120 in November, target $10,500 in December">
    <line x1="${pad}" y1="${targetY}" x2="${width - pad}" y2="${targetY}" stroke="#c77f0a" stroke-dasharray="5 4" />
    <text x="${width - pad}" y="${targetY - 6}" class="target-label" text-anchor="end">Dec target $10,500</text>
    <polyline points="${points}" fill="none" stroke="#1f4d2e" stroke-width="2.5" />
    ${dots}${labels}
  </svg><p class="chart-note">Net worth climbed from $8,400 in June to $10,120 in November — $380 short of the December target, one good month away.</p>`;
}

// A ring showing how far a goal has come, with the saved/target numbers.
export function goalRing(goal) {
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const dash = `${pct} ${100 - pct}`;
  return `<div class="goal-ring-wrap">
    <svg viewBox="0 0 42 42" class="goal-ring" role="img" aria-label="${goal.name}: ${pct}% funded">
      <circle r="15.9155" cx="21" cy="21" fill="transparent" stroke="#e3ddcc" stroke-width="5"></circle>
      <circle r="15.9155" cx="21" cy="21" fill="transparent" stroke="#1f4d2e" stroke-width="5" stroke-dasharray="${dash}" stroke-dashoffset="25"></circle>
      <text x="21" y="23" class="donut-center">${pct}%</text>
    </svg>
    <p class="goal-nums"><b>$${goal.saved.toLocaleString("en-US")}</b> of $${goal.target.toLocaleString("en-US")}</p>
  </div>`;
}
