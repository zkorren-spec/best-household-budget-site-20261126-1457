// Seed data for the Marlowe household, November 2026.
// One source of truth: every page derives its numbers from these tables,
// so a figure shown in two places is always the same figure.

export const HOUSEHOLD = {
  name: "The Marlowe household",
  month: "November 2026",
  members: "Ana & Ben Marlowe · Milo (9) · June (6) · Biscuit the dog",
  currency: "USD",
  note: "Zero-based budget: all $4,200 of November income is assigned to an envelope before the month begins.",
};

export const INCOME = [
  { date: "2026-11-01", source: "Paycheck — Ana Marlowe", amount: 2100 },
  { date: "2026-11-01", source: "Paycheck — Ben Marlowe", amount: 1400 },
  { date: "2026-11-14", source: "Freelance — Ana Marlowe", amount: 700 },
];

// allocated + spent reconcile with TRANSACTIONS below:
// total allocated $4,200 = total November income; total spent $3,476.
export const ENVELOPES = [
  { id: "housing", name: "Housing", note: "Rent, electric and water.", allocated: 1650, spent: 1577 },
  { id: "groceries", name: "Groceries", note: "Weekly market runs, all four weeks.", allocated: 640, spent: 512 },
  { id: "transport", name: "Transport", note: "Gas plus two transit passes.", allocated: 280, spent: 193 },
  { id: "dining", name: "Dining Out", note: "One restaurant night a week, no more.", allocated: 220, spent: 186 },
  { id: "fun", name: "Fun & Family", note: "Movies, games and craft kits.", allocated: 130, spent: 96 },
  { id: "savings", name: "Savings", note: "Auto-transfer on the 1st, never touched.", allocated: 400, spent: 400 },
  { id: "giving", name: "Giving", note: "Food bank, first Sunday.", allocated: 50, spent: 50 },
  { id: "health", name: "Health", note: "Pharmacy and the dentist copay.", allocated: 150, spent: 64 },
  { id: "household", name: "Household", note: "Cleaning, bulbs and small fixes.", allocated: 130, spent: 58 },
  { id: "kids", name: "Kids & School", note: "Lunches, field trip, notebooks.", allocated: 200, spent: 142 },
  { id: "buffer", name: "Buffer", note: "The umbrella-and-batteries fund.", allocated: 150, spent: 41 },
  { id: "phone", name: "Phone & Subscriptions", note: "Internet, two phone lines, streaming.", allocated: 200, spent: 157 },
];

// All 37 November transactions. Each one lands in exactly one envelope,
// and the per-envelope sums below equal the ENVELOPES spent figures:
// Housing 1577 · Groceries 512 · Transport 193 · Dining 186 · Fun 96 ·
// Savings 400 · Giving 50 · Health 64 · Household 58 · Kids 142 · Buffer 41 ·
// Phone 157 — total $3,476.
export const TRANSACTIONS = [
  { date: "2026-11-01", description: "Rent — Marlowe House", category: "Housing", amount: 1450 },
  { date: "2026-11-01", description: "Transit pass — Ana", category: "Transport", amount: 55 },
  { date: "2026-11-01", description: "Transit pass — Ben", category: "Transport", amount: 48 },
  { date: "2026-11-01", description: "Savings auto-transfer", category: "Savings", amount: 400 },
  { date: "2026-11-02", description: "Market — Green Grocer", category: "Groceries", amount: 118 },
  { date: "2026-11-03", description: "Gas — Shell on Route 9", category: "Transport", amount: 42 },
  { date: "2026-11-03", description: "Food bank donation", category: "Giving", amount: 50 },
  { date: "2026-11-04", description: "School lunches", category: "Kids & School", amount: 36 },
  { date: "2026-11-05", description: "Pharmacy — cold medicine", category: "Health", amount: 24 },
  { date: "2026-11-06", description: "Cleaning supplies", category: "Household", amount: 24 },
  { date: "2026-11-07", description: "Pizza night — Tony's", category: "Dining Out", amount: 38 },
  { date: "2026-11-08", description: "Movie night — two tickets", category: "Fun & Family", amount: 34 },
  { date: "2026-11-09", description: "Market — Green Grocer", category: "Groceries", amount: 126 },
  { date: "2026-11-10", description: "Umbrella — Milo broke his", category: "Buffer", amount: 18 },
  { date: "2026-11-12", description: "Electric bill", category: "Housing", amount: 86 },
  { date: "2026-11-13", description: "Field trip — science museum", category: "Kids & School", amount: 37 },
  { date: "2026-11-14", description: "Noodle house", category: "Dining Out", amount: 44 },
  { date: "2026-11-15", description: "Water bill", category: "Housing", amount: 41 },
  { date: "2026-11-15", description: "Board game — Ticket to Ride", category: "Fun & Family", amount: 28 },
  { date: "2026-11-16", description: "Market — Green Grocer", category: "Groceries", amount: 131 },
  { date: "2026-11-16", description: "Batteries", category: "Buffer", amount: 9 },
  { date: "2026-11-17", description: "Gas — Shell on Route 9", category: "Transport", amount: 48 },
  { date: "2026-11-18", description: "Light bulbs", category: "Household", amount: 15 },
  { date: "2026-11-18", description: "Notebooks & pencils", category: "Kids & School", amount: 28 },
  { date: "2026-11-19", description: "Pharmacy — vitamins", category: "Health", amount: 40 },
  { date: "2026-11-20", description: "Internet bill", category: "Phone & Subscriptions", amount: 65 },
  { date: "2026-11-20", description: "Taco truck", category: "Dining Out", amount: 31 },
  { date: "2026-11-21", description: "Craft kits — June's birthday prep", category: "Fun & Family", amount: 34 },
  { date: "2026-11-22", description: "After-school club", category: "Kids & School", amount: 33 },
  { date: "2026-11-23", description: "Market — Green Grocer", category: "Groceries", amount: 137 },
  { date: "2026-11-24", description: "Phone bill", category: "Phone & Subscriptions", amount: 92 },
  { date: "2026-11-24", description: "Bistro — anniversary dinner", category: "Dining Out", amount: 40 },
  { date: "2026-11-24", description: "Tape & glue", category: "Buffer", amount: 14 },
  { date: "2026-11-25", description: "Library fine — overdue book", category: "Kids & School", amount: 8 },
  { date: "2026-11-25", description: "Doormat", category: "Household", amount: 19 },
  { date: "2026-11-26", description: "Bakery brunch", category: "Dining Out", amount: 21 },
  { date: "2026-11-26", description: "Coffee & pastry", category: "Dining Out", amount: 12 },
];

// Eight bills, $1,915 in total: $1,734 paid, $181 still waiting.
// The paid ones match transactions (rent, electric, water, internet, phone);
// the unpaid ones (gym, car insurance, streaming) have no transaction yet.
export const BILLS = [
  { id: "rent", name: "Rent", amount: 1450, due: "2026-11-01", status: "paid", envelope: "Housing", note: "Paid on the 1st, same as always." },
  { id: "electric", name: "Electric", amount: 86, due: "2026-11-12", status: "paid", envelope: "Housing", note: "Autopay, Nov 12." },
  { id: "water", name: "Water", amount: 41, due: "2026-11-15", status: "paid", envelope: "Housing", note: "Autopay, Nov 15." },
  { id: "internet", name: "Internet", amount: 65, due: "2026-11-20", status: "paid", envelope: "Phone & Subscriptions", note: "Autopay, Nov 20." },
  { id: "phone", name: "Phone — two lines", amount: 92, due: "2026-11-24", status: "paid", envelope: "Phone & Subscriptions", note: "Autopay, Nov 24." },
  { id: "gym", name: "Gym — family plan", amount: 45, due: "2026-11-28", status: "due", envelope: "Health", note: "Due Saturday — the Health envelope still holds $86." },
  { id: "car-insurance", name: "Car insurance", amount: 118, due: "2026-11-30", status: "due", envelope: "Transport", note: "Due Monday — Transport still holds $87." },
  { id: "streaming", name: "Streaming bundle", amount: 18, due: "2026-12-01", status: "upcoming", envelope: "Phone & Subscriptions", note: "First bill of December." },
];

// Four savings goals. Emergency fund 65%, summer trip 40%,
// Milo's bike 66%, kitchen refresh 20%.
export const GOALS = [
  { id: "emergency", name: "Emergency fund", saved: 3250, target: 5000, note: "Six weeks of expenses, for the month nobody plans for.", deadline: "Mar 2027" },
  { id: "summer-trip", name: "Summer trip — the coast", saved: 480, target: 1200, note: "Three nights by the sea; Milo wants to learn to surf.", deadline: "Jun 2027" },
  { id: "bike", name: "Bike for Milo", saved: 210, target: 320, note: "The red one from the shop on Main Street.", deadline: "Dec 2026" },
  { id: "kitchen", name: "Kitchen refresh", saved: 180, target: 900, note: "New faucet, paint, and shelves that actually close.", deadline: "Sep 2027" },
];

// Six months of spending and net worth. November spending $3,476 is the
// highest yet; net worth $8,400 (Jun) → $10,120 (Nov), Dec target $10,500.
export const MONTHS = [
  { label: "Jun", spent: 3180, netWorth: 8400 },
  { label: "Jul", spent: 3290, netWorth: 8700 },
  { label: "Aug", spent: 3410, netWorth: 9100 },
  { label: "Sep", spent: 3240, netWorth: 9450 },
  { label: "Oct", spent: 3380, netWorth: 9800 },
  { label: "Nov", spent: 3476, netWorth: 10120 },
];
