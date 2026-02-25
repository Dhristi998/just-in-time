import { useState, useRef } from 'react'

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbynTVyf4AnHuK7cc0TcaTL-IG_eyNuBLY_1kCzynH1U3jDe3UTujVik611UxW86Bomb8Q/exec'

async function submitToSheets(form) {
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
    })
  } catch (e) {
    console.error('Sheets submit error:', e)
  }
}

const FILM_MENU = {
  hot_breakfast: {
    label: 'Hot Breakfast', icon: '🍳',
    items: [
      'Breakfast Sandwich (Egg & Cheese, Choice of Meat)',
      'Breakfast Burritos (Egg, Cheese, Potato, Choice of Meat)',
      'Classic Eggs Benedict',
      'Eggs Any Style',
      'Farm-Fresh Scrambled Eggs',
      'Omelet Your Way (Chef-Attended Station Available)',
      'Egg Whites with Spinach & Tomatoes',
      'Maple Smoked Bacon',
      'Turkey Sausage & Pork Sausage Links',
      'Breakfast Potatoes with Peppers & Onions',
      'Buttermilk Pancakes with Maple Syrup',
      'French Toast with Cinnamon Sugar',
      'Oatmeal Bar with Brown Sugar, Raisins & Nuts',
    ],
  },
  bakery: {
    label: 'Bakery & Breads', icon: '🥐',
    items: [
      'Fresh-Baked Croissants (Butter & Chocolate)',
      'Assorted Muffins',
      'Bagels with Cream Cheese (Plain, Chive, Veggie)',
      'Artisan Toast Selection (White, Wheat, Multigrain)',
      'English Muffins',
    ],
  },
  healthy: {
    label: 'Fresh & Healthy', icon: '🥗',
    items: [
      'Seasonal Fruit Platter',
      'Greek Yogurt & Parfait Station (Granola, Berries, Honey)',
      'Chia Pudding Cups',
      'Hard-Boiled Eggs',
      'Avocado Toast Bar',
    ],
  },
  beverages: {
    label: 'Beverages', icon: '☕',
    items: [
      'Freshly Brewed Coffee (Regular & Decaf)',
      'Selection of Teas',
      'Fresh Orange & Apple Juice',
      'Infused Water (Lemon, Cucumber, Mint)',
      'Assorted Soft Drinks',
    ],
  },
  dietary: {
    label: 'Dietary-Friendly', icon: '🌱',
    items: [
      'Vegan Breakfast Scramble',
      'Plant-Based Sausage',
      'Gluten-Free Bread & Pastries',
      'Dairy-Free Milk Options (Almond, Oat, Soy)',
    ],
  },
  entrees: {
    label: 'Entrées', icon: '🍽️',
    items: [
      'Herb-Crusted Roast Beef — Red wine jus, garlic mashed potatoes, seasonal vegetables',
      'Lemon Herb Grilled Chicken — Wild rice, roasted market vegetables',
      'Braised Short Ribs — Creamy polenta, honey-glazed carrots',
      'Mediterranean Stuffed Chicken — Spinach, feta & sun-dried tomatoes, roasted baby potatoes, grilled zucchini',
      'Blackened Cajun Salmon — Jasmine rice, sautéed green beans',
      'Beef Tenderloin Medallions — Mushroom peppercorn sauce, truffle mashed potatoes, asparagus',
      'Vegetable Lasagna (Vegetarian) — Grilled seasonal vegetables, ricotta, marinara, fresh basil',
      'Chickpea & Sweet Potato Curry (Vegan) — Coconut curry sauce, basmati rice, warm naan',
      'Stuffed Bell Peppers (Vegetarian / Vegan Option) — Quinoa, black beans, corn, fresh herbs',
    ],
  },
  soups: {
    label: 'Soups', icon: '🍲',
    items: [
      'Roasted Tomato Basil',
      'Chicken & Wild Rice',
      'Cream of Broccoli & Aged Cheddar',
      'Tuscan White Bean & Sausage',
      'Thai Coconut Curry (Vegan & Gluten-Free)',
      'French Onion with Gruyère Crouton',
    ],
  },
  salads: {
    label: 'Salads', icon: '🥬',
    items: [
      'Caesar Salad',
      'House Green Salad',
      'Strawberry Spinach & Candied Pecan',
      'Mediterranean Quinoa',
      'Apple Walnut & Blue Cheese',
      'Asian Sesame Slaw',
      'Caprese Salad',
      'Southwest Black Bean & Corn',
    ],
  },
  desserts: {
    label: 'Desserts', icon: '🍰',
    items: [
      'Classic New York Cheesecake — Seasonal berry compote',
      'Chocolate Decadence Cake — Silky ganache, chocolate curls',
      'Tiramisu — Espresso-soaked ladyfingers, mascarpone cream',
      'Crème Brûlée — Vanilla bean custard, caramelized sugar crust',
      'Carrot Cake — Cream cheese frosting, toasted walnuts',
      'Lemon Tart — Tangy lemon curd, fresh berries',
    ],
  },
}

// ── Per-category image sets (5 images each, from /fm/<folder>/) ──
const CATEGORY_IMAGES = {
  hot_breakfast: [
    { src: '/fm/breakfast (1).png', alt: 'Breakfast 1' },
    { src: '/fm/breakfast (2).png', alt: 'Breakfast 2' },
    { src: '/fm/breakfast (3).png', alt: 'Breakfast 3' },
    { src: '/fm/breakfast (4).png', alt: 'Breakfast 4' },
    { src: '/fm/breakfast (5).png', alt: 'Breakfast 5' },
  ],
  bakery: [
    { src: '/fm/bakery (1).png', alt: 'Bakery 1' },
    { src: '/fm/bakery (2).png', alt: 'Bakery 2' },
    { src: '/fm/bakery (3).png', alt: 'Bakery 3' },
    { src: '/fm/bakery (4).png', alt: 'Bakery 4' },
    { src: '/fm/bakery (5).png', alt: 'Bakery 5' },
  ],
  healthy: [
    { src: '/fm/fresh (1).png', alt: 'Healthy 1' },
    { src: '/fm/fresh (2).png', alt: 'Healthy 2' },
    { src: '/fm/fresh (3).png', alt: 'Healthy 3' },
    { src: '/fm/fresh (4).png', alt: 'Healthy 4' },
    { src: '/fm/fresh (5).png', alt: 'Healthy 5' },
  ],
  beverages: [
    { src: '/fm/beverages (1).png', alt: 'Beverages 1' },
    { src: '/fm/beverages (2).png', alt: 'Beverages 2' },
    { src: '/fm/beverages (3).png', alt: 'Beverages 3' },
    { src: '/fm/beverages (4).png', alt: 'Beverages 4' },
    { src: '/fm/beverages (5).png', alt: 'Beverages 5' },
  ],
  dietary: [
    { src: '/fm/healthy (1).png', alt: 'Dietary 1' },
    { src: '/fm/healthy (2).png', alt: 'Dietary 2' },
    { src: '/fm/healthy (3).png', alt: 'Dietary 3' },
    { src: '/fm/healthy (4).png', alt: 'Dietary 4' },
  ],
  entrees: [
    { src: '/fm/entres (1).png', alt: 'Entrees 1' },
    { src: '/fm/entres (2).png', alt: 'Entrees 2' },
    { src: '/fm/entres (3).png', alt: 'Entrees 3' },
    { src: '/fm/entres (4).png', alt: 'Entrees 4' },
    { src: '/fm/entres (5).png', alt: 'Entrees 5' },
  ],
  soups: [
    { src: '/fm/soups (1).png', alt: 'Soups 1' },
    { src: '/fm/soups (2).png', alt: 'Soups 2' },
    { src: '/fm/soups (3).png', alt: 'Soups 3' },
    { src: '/fm/soups (4).png', alt: 'Soups 4' },
    { src: '/fm/soups (5).png', alt: 'Soups 5' },
  ],
  salads: [
    { src: '/fm/salad (1).png', alt: 'Salads 1' },
    { src: '/fm/salad (2).png', alt: 'Salads 2' },
    { src: '/fm/salad (3).png', alt: 'Salads 3' },
    { src: '/fm/salad (4).png', alt: 'Salads 4' },
    { src: '/fm/salad (5).png', alt: 'Salads 5' },
  ],
  desserts: [
    { src: '/fm/desserts (1).png', alt: 'Desserts 1' },
    { src: '/fm/desserts (2).png', alt: 'Desserts 2' },
    { src: '/fm/desserts (3).png', alt: 'Desserts 3' },
    { src: '/fm/desserts (4).png', alt: 'Desserts 4' },
    { src: '/fm/desserts (5).png', alt: 'Desserts 5' },
  ],
}

// ── Toggle tabs — no "All" tab ──
const TOGGLE_TABS = [
  { key: 'hot_breakfast', label: 'Hot Breakfast' },
  { key: 'bakery', label: 'Bakery & Breads' },
  { key: 'healthy', label: 'Fresh & Healthy' },
  { key: 'beverages', label: 'Beverages' },
  { key: 'dietary', label: 'Dietary-Friendly' },
  { key: 'entrees', label: 'Entrées' },
  { key: 'soups', label: 'Soups' },
  { key: 'salads', label: 'Salads' },
  { key: 'desserts', label: 'Desserts' },
]

const GALLERY = [
  { id: 1, src: '/new (1).png', alt: 'Dessert spread' },
  { id: 2, src: '/new (2).png', alt: 'Fruit & charcuterie' },
  { id: 3, src: '/new (3).png', alt: 'Cheese & dips board' },
  { id: 4, src: '/new (4).png', alt: 'Pasta salad' },
  { id: 5, src: '/new (5).png', alt: 'Brisket & logo' },
  { id: 6, src: '/new (6).png', alt: 'Truck kitchen' },
  { id: 7, src: '/new (7).png', alt: 'Truck service setup' },
  { id: 8, src: '/new (8).png', alt: 'Truck exterior' },
  { id: 9, src: '/new (9).png', alt: 'Chef figurine' },
  { id: 10, src: '/new (11).png', alt: 'Salad bar outdoor' },
  { id: 11, src: '/new (12).png', alt: 'Vegetarian stacks' },
  { id: 12, src: '/new (13).png', alt: 'Dessert table' },
  { id: 13, src: '/new (10).png', alt: 'Team at event' },
  { id: 14, src: '/new (16).png', alt: 'Veggie & fruit board' },
  { id: 15, src: '/new (17).png', alt: 'Truck rainbow' },
]

const FILM_CREDITS = [
  { title: 'A Nice Indian Boy', type: 'Feature' },
  { title: 'Fire Country', type: '2nd Unit' },
  { title: 'Ludwig', type: 'Season 3, 2nd Unit' },
  { title: "It's a Wonderful Knife", type: 'Feature' },
  { title: 'Cold Copy', type: 'Feature' },
  { title: 'Christmas on Candy Cane Lane', type: 'Feature' },
  { title: 'It Lives Inside', type: 'Feature' },
  { title: 'Fit for Christmas', type: 'Feature' },
  { title: 'I Will Survive', type: 'Feature' },
  { title: 'A Family Affair', type: 'Feature' },
  { title: 'Christmas Crashers', type: 'Feature' },
  { title: 'Camp Miasma', type: 'Feature – Vancouver Island' },
  { title: 'The Best Is Yet to Come', type: 'Feature' },
  { title: 'Karen Read', type: 'Feature' },
  { title: 'Rags 2 Richmond', type: 'Feature' },
]

const LIVE_EVENTS = [
  { title: 'Vancouver Folk Music Festival', type: '2025' },
  { title: 'Canada Day Coquitlam', type: 'Live Event' },
  { title: 'Italian Day Vancouver', type: 'Live Event' },
  { title: 'Khatsahlano Street Party Vancouver', type: 'Live Event' },
  { title: "The Sky's No Limit — She is Anything Abbotsford", type: 'Live Event' },
  { title: 'Country Fest Maple Ridge · Pitt Meadows', type: 'Live Event' },
]

const STEPS = ['Service & Cuisine', 'Meal Prefs', 'Guests', 'Date & Time', 'Location', 'Budget', 'Contact']

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 18px; }
body {
  background: #151515; color: #f2f2f2;
  font-family: 'Outfit', sans-serif; font-weight: 300;
  overflow-x: hidden; -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #111; }
::-webkit-scrollbar-thumb { background: #2d6a3f; border-radius: 2px; }

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 300;
  height: 72px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 64px;
  background: rgba(17,17,17,0.95); backdrop-filter: blur(18px);
  border-bottom: 1px solid #2e2e2e;
}
.nav-logo-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.nav-logo-img {
  width: 48px; height: 48px; border-radius: 50%;
  border: 1.5px solid #2d6a3f; background: #222;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; color: #8DC63F; font-weight: 700; overflow: hidden;
}
.nav-logo-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.nav-logo-text { font-size: 1.3rem; font-weight: 600; letter-spacing: 0.01em; color: #f2f2f2; }
.nav-logo-text span { color: #8DC63F; }
.nav-right { display: flex; align-items: center; gap: 6px; }
.nav-link {
  background: none; border: none; color: #b0b0b0;
  font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 400;
  letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
  padding: 10px 22px; border-radius: 100px;
  transition: color 0.2s, background 0.2s;
}
.nav-link:hover { color: #f2f2f2; background: rgba(255,255,255,0.05); }
.nav-link.pop { animation: navPop 0.38s ease forwards; }
@keyframes navPop {
  0%   { background: rgba(45,106,63,0); color: #b0b0b0; transform: scale(1); }
  45%  { background: rgba(45,106,63,0.25); color: #fff; transform: scale(1.07); }
  100% { background: rgba(255,255,255,0); color: #f2f2f2; transform: scale(1); }
}

.burger { display: none; background: none; border: none; flex-direction: column; gap: 6px; cursor: pointer; padding: 6px; }
.burger span { display: block; width: 26px; height: 2px; background: #b0b0b0; border-radius: 2px; transition: all 0.25s; }
.burger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); background: #f2f2f2; }
.burger.open span:nth-child(2) { opacity: 0; }
.burger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); background: #f2f2f2; }

.drawer {
  display: none; position: fixed; top: 72px; left: 0; right: 0; bottom: 0; z-index: 290;
  background: rgba(15,15,15,0.99); backdrop-filter: blur(14px);
  flex-direction: column; align-items: flex-start; padding: 52px 36px;
}
.drawer.open { display: flex; }
.drawer-link {
  width: 100%; background: none; border: none; border-bottom: 1px solid #2e2e2e;
  color: #b0b0b0; font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 400;
  letter-spacing: 0.08em; text-transform: uppercase; text-align: left;
  padding: 26px 0; cursor: pointer; transition: color 0.2s;
}
.drawer-link:hover { color: #f2f2f2; }
.drawer-cta {
  margin-top: 44px; width: 100%;
  background: #8DC63F; color: #1a1a1a; border: none;
  padding: 20px 32px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 1.1rem; letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; transition: background 0.2s;
}
.drawer-cta:hover { background: #a0d94a; }

/* ── BUTTONS ── */
.btn-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: #8DC63F; color: #1a1a1a; border: none;
  padding: 17px 42px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 1.05rem; letter-spacing: 0.06em; text-transform: uppercase;
  cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-pill:hover { background: #a0d94a; transform: translateY(-3px); box-shadow: 0 12px 36px rgba(141,198,63,0.4); }
.btn-pill:active { transform: scale(0.96); }
.btn-pill:disabled { background: #3a3a3a; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-pill-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.08); color: #f2f2f2;
  border: 1.5px solid rgba(255,255,255,0.35); padding: 17px 42px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-weight: 500;
  font-size: 1.05rem; letter-spacing: 0.06em; text-transform: uppercase;
  cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-pill-ghost:hover {
  background: rgba(255,255,255,0.16); border-color: rgba(255,255,255,0.65);
  color: #ffffff; transform: translateY(-3px); box-shadow: 0 8px 28px rgba(255,255,255,0.1);
}
.btn-pill-ghost:active { transform: scale(0.96); }

/* ── HERO ── */
.hero {
  min-height: 100vh; position: relative; overflow: hidden;
  display: flex; align-items: flex-end; padding: 110px 64px 72px;
}
.hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background: url('/truck.jpeg') center center / cover no-repeat;
}
/* Dark overlay at bottom only — lets the full truck image show through */
.hero-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(
    to top,
    rgba(17,17,17,0.65) 0%,
    rgba(17,17,17,0.22) 45%,
    rgba(17,17,17,0.0) 100%
  );
}
.hero-content {
  position: relative; z-index: 1; max-width: 620px; width: 100%;
  text-shadow: 0 2px 16px rgba(0,0,0,0.55);
}

.hero h1 em { color: #8DC63F; font-style: normal; }
.hero-sub {
  font-size: 1.15rem; color: #c0c0c0; line-height: 1.85;
  max-width: 460px; margin-bottom: 44px; font-weight: 300;
}
.hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

/* ── SHARED SECTION HEADERS ── */
.sec-tag { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.sec-tag-line { width: 32px; height: 1.5px; background: #2d6a3f; }
.sec-tag span { font-size: 0.8rem; letter-spacing: 0.22em; text-transform: uppercase; color: #8DC63F; font-weight: 500; }
.sec-title {
  font-size: clamp(2.4rem, 4.5vw, 3.8rem); font-weight: 700; color: #f2f2f2;
  letter-spacing: -0.02em; line-height: 1.08; margin-bottom: 18px;
}
.sec-sub { font-size: 1.05rem; color: #757575; line-height: 1.85; font-weight: 300; max-width: 520px; margin-bottom: 48px; }

/* ── GALLERY ── */
.gallery-section { padding: 110px 64px; background: #151515; }
.gallery-grid {
  display: grid; grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 240px; gap: 12px;
}
.gallery-item {
  border-radius: 12px; overflow: hidden; position: relative; cursor: pointer;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.gallery-item:hover { transform: scale(1.02); box-shadow: 0 16px 48px rgba(0,0,0,0.6); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
.gallery-item:hover img { transform: scale(1.07); }
.gallery-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(17,17,17,0.5) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.3s;
}
.gallery-item:hover .gallery-overlay { opacity: 1; }

/* ── FILM SECTION ── */
.film-section { padding: 110px 64px; background: #111111; }
.film-tagline {
  font-size: 1rem; color: #8DC63F; font-style: italic; font-weight: 400;
  letter-spacing: 0.04em; margin-bottom: 40px; opacity: 0.9;
}
.film-filter { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
.ftab {
  padding: 9px 20px; border-radius: 100px; border: 1.5px solid #2e2e2e;
  background: transparent; color: #757575; font-family: 'Outfit', sans-serif;
  font-size: 0.82rem; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.ftab.on { background: #8DC63F; border-color: #8DC63F; color: #1a1a1a; font-weight: 600; }
.ftab:not(.on):hover { border-color: #757575; color: #b0b0b0; }

.film-cards { display: flex; flex-direction: column; gap: 4px; }
.film-card {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 16px 22px; border-radius: 12px;
  background: #1a1a1a; border: 1px solid #2e2e2e;
  transition: border-color 0.2s, background 0.2s;
}
.film-card:hover { border-color: rgba(45,106,63,0.4); background: rgba(34,34,34,0.95); }
.film-card-name { font-size: 0.97rem; font-weight: 400; color: #b0b0b0; line-height: 1.5; }
.film-card-cat {
  font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: #8DC63F; font-weight: 500; white-space: nowrap; flex-shrink: 0;
  background: rgba(45,106,63,0.14); border: 1px solid rgba(45,106,63,0.28);
  padding: 4px 12px; border-radius: 100px;
}
.film-section-header {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 0 10px; border-bottom: 1px solid #2a2a2a; margin-bottom: 4px;
}
.film-section-header-icon { font-size: 1.15rem; }
.film-section-header-label {
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.2em;
  text-transform: uppercase; color: #8DC63F;
}

/* images grid — 5 cols for category */
.film-images-grid {
  display: grid; gap: 10px; margin-top: 52px;
  grid-template-columns: repeat(5, 1fr);
}

.film-img-item {
  border-radius: 12px; overflow: hidden; aspect-ratio: 4 / 3;
  border: 1.5px solid rgba(45,106,63,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
}
.film-img-item:hover {
  transform: scale(1.04) translateY(-3px);
  box-shadow: 0 12px 36px rgba(45,106,63,0.25);
  border-color: rgba(141,198,63,0.5);
}
.film-img-item img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ── BOOKING ── */
.book-section { padding: 110px 64px; background: #151515; }
.book-center { max-width: 780px; margin: 0 auto; }
.wiz-card {
  background: #222222; border: 1px solid #2e2e2e;
  border-radius: 20px; overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.5);
}
.wiz-prog { height: 3px; background: #2e2e2e; }
.wiz-prog-fill { height: 100%; background: #8DC63F; transition: width 0.4s ease; }
.wiz-head {
  padding: 22px 44px; border-bottom: 1px solid #2e2e2e;
  display: flex; align-items: center; justify-content: space-between;
}
.wiz-step-info { font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase; color: #404040; }
.wiz-step-info strong { color: #8DC63F; font-weight: 600; }
.wiz-step-dots { display: flex; gap: 7px; }
.wiz-dot { width: 8px; height: 8px; border-radius: 50%; background: #2e2e2e; transition: background 0.3s; }
.wiz-dot.done { background: rgba(45,106,63,0.5); }
.wiz-dot.now  { background: #8DC63F; }
.wiz-body { padding: 48px 44px 44px; }
.wiz-h { font-size: 2.1rem; font-weight: 700; color: #f2f2f2; margin-bottom: 8px; letter-spacing: -0.01em; }
.wiz-p { font-size: 1.05rem; color: #757575; line-height: 1.75; margin-bottom: 36px; font-weight: 300; }

.opts { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 12px; }
.opt {
  background: #1e1e1e; border: 1.5px solid #2e2e2e; border-radius: 14px; padding: 26px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  cursor: pointer; text-align: center; user-select: none;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
}
.opt:hover { border-color: #757575; transform: translateY(-3px); }
.opt.on { border-color: #8DC63F; background: rgba(141,198,63,0.1); transform: translateY(-3px); }
.opt-ico { font-size: 2.2rem; line-height: 1; }
.opt-lbl { font-size: 0.95rem; font-weight: 400; color: #757575; }
.opt.on .opt-lbl { color: #f2f2f2; }

.flabel {
  display: block; font-size: 0.88rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: #9a9a9a; font-weight: 500; margin-bottom: 12px;
}

.wiz-section-label {
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
}
.wiz-section-label span {
  font-size: 0.82rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: #c0c0c0; font-weight: 600; white-space: nowrap;
}
.wiz-section-label::before, .wiz-section-label::after { content: ''; flex: 1; height: 1px; background: #2e2e2e; }
.wiz-section-label::before { display: none; }

.inp {
  width: 100%; background: #1e1e1e; border: 1px solid #2e2e2e;
  border-radius: 12px; padding: 16px 18px; color: #f2f2f2;
  font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 300;
  outline: none; transition: border-color 0.2s; appearance: none;
}
.inp:focus { border-color: #4a9e64; }
.inp::placeholder { color: #404040; }
.inp[readonly] { cursor: default; opacity: 0.75; }

.wiz-nav {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 40px; padding-top: 28px; border-top: 1px solid #2e2e2e;
}
.btn-back-wiz {
  background: none; border: 1.5px solid #2e2e2e; color: #757575;
  padding: 13px 30px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 400;
  letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.btn-back-wiz:hover { border-color: #757575; color: #b0b0b0; }

.confirm-wrap { text-align: center; padding: 24px 0 12px; }
.confirm-ring {
  width: 90px; height: 90px; border-radius: 50%; border: 2px solid #2d6a3f;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.4rem; margin: 0 auto 32px; background: rgba(45,106,63,0.1);
  animation: ringPop 0.5s ease;
}
@keyframes ringPop {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.confirm-h { font-size: 2.1rem; font-weight: 700; color: #f2f2f2; margin-bottom: 14px; }
.confirm-p { font-size: 1.05rem; color: #757575; line-height: 1.85; font-weight: 300; }
.confirm-p strong { color: #b0b0b0; font-weight: 500; }

/* ── PORTFOLIO ── */
.portfolio-section { padding: 110px 64px; background: #111111; }
.portfolio-about {
  display: grid; grid-template-columns: 1.3fr 1fr; gap: 80px;
  align-items: start; margin-bottom: 72px;
  padding-bottom: 64px; border-bottom: 1px solid #2e2e2e;
}
.portfolio-about-text p {
  font-size: 1.05rem; color: #757575; line-height: 1.9; font-weight: 300; margin-bottom: 20px;
}
.portfolio-badge-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px; }
.portfolio-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(45,106,63,0.12); border: 1px solid rgba(45,106,63,0.3);
  color: #8DC63F; font-size: 0.8rem; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase; padding: 8px 18px; border-radius: 100px;
}
.portfolio-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #8DC63F; flex-shrink: 0; }
.portfolio-meta { display: flex; flex-direction: column; gap: 24px; }
.portfolio-meta-card {
  background: #1a1a1a; border: 1px solid #2e2e2e; border-radius: 16px; padding: 24px 28px;
}
.portfolio-meta-label {
  font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: #8DC63F; font-weight: 500; margin-bottom: 10px;
}
.portfolio-meta-card p { font-size: 1rem; color: #b0b0b0; font-weight: 400; line-height: 1.7; }
.portfolio-meta-card ul { list-style: none; padding: 0; }
.portfolio-meta-card ul li {
  font-size: 1rem; color: #b0b0b0; font-weight: 400;
  padding: 4px 0; display: flex; align-items: center; gap: 10px;
}
.portfolio-meta-card ul li::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%; background: #2d6a3f; flex-shrink: 0;
}
.portfolio-credits-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.portfolio-credits-col h4 {
  font-size: 0.78rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: #8DC63F; font-weight: 600; margin-bottom: 20px;
  padding-bottom: 12px; border-bottom: 1px solid #2e2e2e;
}
.credit-list { display: flex; flex-direction: column; gap: 4px; }
.credit-item {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 14px 20px; border-radius: 12px;
  background: #1a1a1a; border: 1px solid #2e2e2e;
  transition: border-color 0.2s, background 0.2s;
}
.credit-item:hover { border-color: rgba(45,106,63,0.35); background: #1e1e1e; }
.credit-item-title { font-size: 0.97rem; font-weight: 400; color: #c0c0c0; }
.credit-item-type {
  font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: #8DC63F; font-weight: 500; white-space: nowrap; flex-shrink: 0;
  background: rgba(45,106,63,0.12); border: 1px solid rgba(45,106,63,0.25);
  padding: 3px 10px; border-radius: 100px;
}
.credit-item-live .credit-item-type {
  color: #f0c040; background: rgba(240,192,64,0.1); border-color: rgba(240,192,64,0.3);
}

/* ── FOOTER ── */
footer {
  background: #111111; border-top: 1px solid #2e2e2e; padding: 80px 64px 52px;
  display: grid; grid-template-columns: 1.8fr 1fr 1fr; gap: 64px;
}
.ft-brand { font-size: 1.4rem; font-weight: 600; color: #f2f2f2; margin-bottom: 16px; display: block; }
.ft-brand span { color: #8DC63F; }
.ft-desc { font-size: 0.95rem; color: #757575; line-height: 1.85; max-width: 280px; margin-bottom: 28px; font-weight: 300; }
.ft-socials { display: flex; gap: 10px; }
.ft-soc {
  width: 42px; height: 42px; border-radius: 50%;
  border: 1px solid #2e2e2e; display: flex; align-items: center; justify-content: center;
  color: #606060; cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
  text-decoration: none;
}
.ft-soc:hover { border-color: #2d6a3f; color: #8DC63F; background: rgba(45,106,63,0.08); }
.ft-soc svg { width: 18px; height: 18px; fill: currentColor; }
.ft-col h5 { font-size: 0.78rem; letter-spacing: 0.18em; text-transform: uppercase; color: #8DC63F; font-weight: 500; margin-bottom: 22px; }
.ft-contact-item {
  display: flex; align-items: center; gap: 10px;
  font-size: 0.95rem; color: #757575; margin-bottom: 14px; font-weight: 300;
  text-decoration: none; transition: color 0.2s;
}
.ft-contact-item:hover { color: #b0b0b0; }
.ft-contact-item svg { width: 16px; height: 16px; flex-shrink: 0; stroke: #8DC63F; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.ft-bar {
  background: #111111; border-top: 1px solid rgba(46,46,46,0.6);
  padding: 22px 64px; display: flex; justify-content: space-between;
}
.ft-bar p { font-size: 0.82rem; color: #404040; }

/* ── RESPONSIVE ── */
@media (max-width: 1200px) {
  .gallery-grid { grid-template-columns: repeat(4, 1fr); }
  .film-images-grid { grid-template-columns: repeat(4, 1fr) !important; }
}
@media (max-width: 1024px) {
  .nav { padding: 0 40px; }
  .film-section, .gallery-section, .book-section, .portfolio-section, .hero { padding-left: 40px; padding-right: 40px; }
  footer { padding-left: 40px; padding-right: 40px; }
  .ft-bar { padding-left: 40px; padding-right: 40px; }
}
@media (max-width: 900px) {
  .gallery-grid { grid-template-columns: repeat(3, 1fr); }
  .film-images-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .portfolio-about { grid-template-columns: 1fr; gap: 40px; }
  .portfolio-credits-wrap { grid-template-columns: 1fr; gap: 36px; }
}
@media (max-width: 768px) {
  html { font-size: 16px; }
  .nav { padding: 0 20px; height: 68px; }
  .nav-right { display: none; }
  .burger { display: flex; }
  .nav-logo-wrap { position: absolute; left: 50%; transform: translateX(-50%); }
  .drawer { top: 68px; }
  .hero { padding: 96px 20px 60px; min-height: 90vh; }
  .hero-btns { flex-direction: column; }
  .btn-pill, .btn-pill-ghost { width: 100%; justify-content: center; }
  .film-section, .gallery-section, .book-section, .portfolio-section { padding: 72px 20px; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 200px; }
  .film-images-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .wiz-body { padding: 28px 20px 24px; }
  .wiz-head { padding: 16px 20px; }
  .book-center { max-width: 100%; }
  .opts { grid-template-columns: repeat(2, 1fr); }
  footer { grid-template-columns: 1fr; gap: 44px; padding: 56px 20px 36px; }
  .ft-bar { padding: 18px 20px; flex-direction: column; gap: 6px; text-align: center; }
}
@media (max-width: 480px) {
  .hero h1 { font-size: 2.6rem; }
  .gallery-grid { grid-template-columns: 1fr; grid-auto-rows: 260px; }
  .film-images-grid { grid-template-columns: repeat(2, 1fr) !important; }
}
`

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filmFilter, setFilmFilter] = useState('hot_breakfast')
  const [navPop, setNavPop] = useState('')
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    service: '', serviceType: '', cuisines: [], meal: [], style: [],
    guests: '', date: '', startTime: '', endTime: '',
    city: '', budget: '',
    name: '', email: '', phone: '',
  })

  const galleryRef = useRef(null)
  const filmRef = useRef(null)
  const bookRef = useRef(null)
  const portfolioRef = useRef(null)

  const scrollTo = (ref, id) => {
    setNavPop(id)
    setTimeout(() => setNavPop(''), 420)
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const pct = (step / (STEPS.length - 1)) * 100
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const togField = (field, val) => setForm(f => ({
    ...f,
    [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val],
  }))

  const canNext = () => {
    if (step === 0) return !!form.service && form.cuisines.length > 0
    if (step === 1) return form.meal.length > 0 && form.style.length > 0
    if (step === 2) return parseInt(form.guests) > 0
    if (step === 3) return !!form.date && !!form.startTime
    if (step === 4) return !!form.city
    if (step === 5) return parseInt(form.budget) > 0
    if (step === 6) return !!form.name && !!form.email && !!form.phone
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await submitToSheets({
      ...form,
      meal: form.meal.join(', '),
      style: form.style.join(', '),
      cuisines: `${form.service}: ${form.cuisines.join(', ')}`,
    })
    setSubmitting(false)
    setDone(true)
  }

  const OptM = ({ icon, label, val, field }) => {
    const on = Array.isArray(form[field]) && form[field].includes(val)
    return (
      <div className={`opt${on ? ' on' : ''}`} onClick={() => togField(field, val)}>
        <span className="opt-ico">{icon}</span>
        <span className="opt-lbl">{label}</span>
      </div>
    )
  }

  const renderMenuCards = () => {
    const section = FILM_MENU[filmFilter]
    if (!section) return null
    return (
      <>
        <div className="film-section-header">
          <span className="film-section-header-icon">{section.icon}</span>
          <span className="film-section-header-label">{section.label}</span>
        </div>
        {section.items.map((item, i) => (
          <div key={i} className="film-card">
            <span className="film-card-name">{item}</span>
          </div>
        ))}
      </>
    )
  }

  const currentImages = CATEGORY_IMAGES[filmFilter] || CATEGORY_IMAGES.hot_breakfast

  return (
    <>
      <style>{css}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <button className={`burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className="nav-logo-wrap" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="nav-logo-img">
            <img src="/logo (1).jpeg" alt="JIT" onError={e => { e.target.style.display = 'none' }} />
          </div>
          <div className="nav-logo-text">Just<span>In</span>Time Catering</div>
        </div>
        <div className="nav-right">
          <button className={`nav-link${navPop === 'film' ? ' pop' : ''}`} onClick={() => scrollTo(filmRef, 'film')}>Film Catering</button>
          <button className={`nav-link${navPop === 'book' ? ' pop' : ''}`} onClick={() => scrollTo(bookRef, 'book')}>Book a Truck</button>
          <button className={`nav-link${navPop === 'portfolio' ? ' pop' : ''}`} onClick={() => scrollTo(portfolioRef, 'portfolio')}>Portfolio</button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`drawer${menuOpen ? ' open' : ''}`}>
        <button className="drawer-link" onClick={() => scrollTo(filmRef, 'film')}>Film Catering</button>
        <button className="drawer-link" onClick={() => scrollTo(portfolioRef, 'portfolio')}>Portfolio</button>
        <button className="drawer-link" onClick={() => scrollTo(bookRef, 'book')}>Book a Truck</button>
        <button className="drawer-cta" onClick={() => scrollTo(bookRef, 'book')}>Reserve Now</button>
      </div>

      {/* HERO — full truck image, text anchored to bottom */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <h1>Fueling Crews<br />&amp; <em>Events,</em><br />Just In Time</h1>
          <p className="hero-sub">Premium food truck catering for film productions, corporate events, and festivals. Fresh, reliable, always on cue.</p>
          <div className="hero-btns">
            <button className="btn-pill" onClick={() => scrollTo(bookRef, 'book')}>Book a Truck</button>
            <button className="btn-pill-ghost" onClick={() => scrollTo(filmRef, 'film')}>Film Catering ↓</button>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section" ref={galleryRef}>
        <div className="sec-tag"><div className="sec-tag-line" /><span>Gallery</span></div>
        <h2 className="sec-title">From the Field</h2>
        <p className="sec-sub">A look at what we bring to every set, event, and festival — real food, real moments.</p>
        <div className="gallery-grid">
          {GALLERY.map(img => (
            <div key={img.id} className="gallery-item">
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div className="gallery-overlay" />
            </div>
          ))}
        </div>
      </section>

      {/* FILM CATERING */}
      <section className="film-section" ref={filmRef}>
        <div className="sec-tag"><div className="sec-tag-line" /><span>Film Catering</span></div>
        <h2 className="sec-title">What We Bring<br />to Set</h2>
        <p className="film-tagline">"First Call to Last Shot — Exceptional Meals, Every Time."</p>

        {/* Toggle tabs — no ALL button */}
        <div className="film-filter">
          {TOGGLE_TABS.map(t => (
            <button key={t.key} className={`ftab${filmFilter === t.key ? ' on' : ''}`} onClick={() => setFilmFilter(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="film-cards">{renderMenuCards()}</div>

        <div className="film-images-grid">
          {currentImages.map((img, i) => (
            <div key={`${filmFilter}-${i}`} className="film-img-item">
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* BOOK A TRUCK */}
      <section className="book-section" ref={bookRef}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="sec-tag" style={{ justifyContent: 'center' }}>
            <div className="sec-tag-line" /><span>Reservations</span><div className="sec-tag-line" />
          </div>
          <h2 className="sec-title">Book a Truck</h2>
          <p style={{ fontSize: '1.05rem', color: '#757575', lineHeight: 1.8, fontWeight: 300, marginTop: 12 }}>
            Tell us about your event and we'll put together the perfect spread.
          </p>
        </div>
        <div className="book-center">
          <div className="wiz-card">
            <div className="wiz-prog"><div className="wiz-prog-fill" style={{ width: done ? '100%' : `${pct}%` }} /></div>
            {!done && (
              <div className="wiz-head">
                <span className="wiz-step-info">Step <strong>{step + 1}</strong> of {STEPS.length} — {STEPS[step]}</span>
                <div className="wiz-step-dots">
                  {STEPS.map((_, i) => <div key={i} className={`wiz-dot${i < step ? ' done' : i === step ? ' now' : ''}`} />)}
                </div>
              </div>
            )}
            <div className="wiz-body">

              {done && (
                <div className="confirm-wrap">
                  <div className="confirm-ring">✓</div>
                  <h3 className="confirm-h">Request Received</h3>
                  <p className="confirm-p">
                    Thank you, <strong>{form.name}</strong>.<br />
                    We'll reach out to <strong>{form.email}</strong> within 24 hours<br />
                    to confirm your booking for <strong>{form.date}</strong>,{' '}
                    <strong>{form.startTime}</strong>{form.endTime ? ` – ${form.endTime}` : ''}.
                  </p>
                </div>
              )}

              {/* STEP 0 — Service & Cuisine */}
              {!done && step === 0 && (
                <>
                  <h3 className="wiz-h">Service Type</h3>
                  <p className="wiz-p">How would you like food served at your event?</p>

                  {/* Primary toggle — À La Carte vs Buffet */}
                  <div style={{ display: 'flex', gap: 14, marginBottom: 36 }}>
                    {[
                      { val: 'alacarte', label: 'À La Carte', icon: '🍽️' },
                      { val: 'buffet', label: 'Buffet', icon: '🥘' },
                    ].map(opt => (
                      <div
                        key={opt.val}
                        className={`opt${form.service === opt.val ? ' on' : ''}`}
                        style={{ flex: 1, padding: '28px 16px' }}
                        onClick={() => { set('service', opt.val); set('cuisines', []) }}
                      >
                        <span className="opt-ico">{opt.icon}</span>
                        <span className="opt-lbl">{opt.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* À La Carte sub-options */}
                  {form.service === 'alacarte' && (
                    <>
                      <div className="wiz-section-label"><span>Choose your style(s)</span></div>
                      <div className="opts">
                        <OptM icon="🔥" label="BBQ" val="bbq" field="cuisines" />
                        <OptM icon="🍔" label="Burgers" val="burgers" field="cuisines" />
                        <OptM icon="🌮" label="Tacos" val="tacos" field="cuisines" />
                        <OptM icon="🍝" label="Pasta" val="pasta" field="cuisines" />
                        <OptM icon="🍳" label="Breakfast" val="breakfast_alacarte" field="cuisines" />
                        <OptM icon="🍰" label="Desserts" val="desserts" field="cuisines" />
                      </div>
                    </>
                  )}

                  {/* Buffet sub-options */}
                  {form.service === 'buffet' && (
                    <>
                      <div className="wiz-section-label"><span>Choose your cuisine(s)</span></div>
                      <div className="opts">
                        <OptM icon="🥐" label="French" val="buffet_french" field="cuisines" />
                        <OptM icon="🍁" label="North American" val="buffet_northam" field="cuisines" />
                        <OptM icon="🍕" label="Italian" val="buffet_italian" field="cuisines" />
                        <OptM icon="🌮" label="Mexican" val="buffet_mexican" field="cuisines" />
                        <OptM icon="🫒" label="Greek" val="buffet_greek" field="cuisines" />
                        <OptM icon="🍛" label="Indian" val="buffet_indian" field="cuisines" />
                        <OptM icon="🌿" label="Vegan" val="buffet_vegan" field="cuisines" />
                        <OptM icon="🥦" label="Vegetarian" val="buffet_vegetarian" field="cuisines" />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* STEP 1 — Meal Prefs */}
              {!done && step === 1 && (
                <>
                  <h3 className="wiz-h">Meal Preferences</h3>
                  <p className="wiz-p">Select all that apply for both sections below.</p>
                  <div className="wiz-section-label"><span>Meal Time</span></div>
                  <div className="opts" style={{ marginBottom: 32 }}>
                    <OptM icon="🌅" label="Breakfast" val="breakfast" field="meal" />
                    <OptM icon="☀️" label="Lunch" val="lunch" field="meal" />
                    <OptM icon="🌙" label="Dinner" val="dinner" field="meal" />
                    <OptM icon="🍪" label="Dessert" val="dessert" field="meal" />
                  </div>
                  <div className="wiz-section-label"><span>Serving Style</span></div>
                  <div className="opts">
                    <OptM icon="🥩" label="Main" val="main" field="style" />
                    <OptM icon="🥗" label="Sides" val="sides" field="style" />
                    <OptM icon="🥤" label="Drinks" val="drinks" field="style" />
                    <OptM icon="🍮" label="Dessert" val="dessert" field="style" />
                  </div>
                </>
              )}

              {/* STEP 2 — Guests */}
              {!done && step === 2 && (
                <><h3 className="wiz-h">Guest Count</h3><p className="wiz-p">How many people are you expecting?</p>
                  <label className="flabel">Number of Guests</label>
                  <input className="inp" type="number" placeholder="e.g. 75" value={form.guests} onChange={e => set('guests', e.target.value)} /></>
              )}

              {/* STEP 3 — Date & Time */}
              {!done && step === 3 && (
                <>
                  <h3 className="wiz-h">Date &amp; Time</h3>
                  <label className="flabel" style={{ marginBottom: 12 }}>Event Date</label>
                  <input className="inp" type="date" value={form.date} onChange={e => set('date', e.target.value)} style={{ marginBottom: 20 }} />
                  <label className="flabel" style={{ marginBottom: 12 }}>Preferred Start Time</label>
                  <input className="inp" type="text" placeholder="e.g. 7:00 AM, after 6 PM, flexible…" value={form.startTime} onChange={e => set('startTime', e.target.value)} style={{ marginBottom: 20 }} />
                  <label className="flabel" style={{ marginBottom: 12 }}>Preferred End Time</label>
                  <input className="inp" type="text" placeholder="e.g. 10:00 PM, by midnight, flexible…" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
                </>
              )}

              {/* STEP 4 — Location */}
              {!done && step === 4 && (
                <>
                  <h3 className="wiz-h">Location</h3>
                  <p className="wiz-p">We operate across British Columbia.</p>
                  <label className="flabel">City</label>
                  <input className="inp" placeholder="e.g. Vancouver, Surrey, Burnaby..." value={form.city} onChange={e => set('city', e.target.value)} />
                </>
              )}

              {/* STEP 5 — Budget */}
              {!done && step === 5 && (
                <><h3 className="wiz-h">Budget</h3><p className="wiz-p">What's your approximate budget for this event?</p>
                  <label className="flabel">Estimated Budget (CAD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#404040', fontSize: '1.1rem' }}>$</span>
                    <input className="inp" type="number" placeholder="e.g. 1,500" style={{ paddingLeft: 32 }} value={form.budget} onChange={e => set('budget', e.target.value)} />
                  </div></>
              )}

              {/* STEP 6 — Contact */}
              {!done && step === 6 && (
                <><h3 className="wiz-h">Contact Info</h3><p className="wiz-p">We'll use these to confirm your booking.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div><label className="flabel">Full Name</label><input className="inp" placeholder="Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} /></div>
                    <div><label className="flabel">Email Address</label><input className="inp" type="email" placeholder="jane@production.com" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                    <div><label className="flabel">Phone Number</label><input className="inp" type="tel" placeholder="+1 (604) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
                  </div></>
              )}

              {!done && (
                <div className="wiz-nav">
                  {step > 0 ? <button className="btn-back-wiz" onClick={() => setStep(s => s - 1)}>← Back</button> : <span />}
                  <button className="btn-pill" disabled={!canNext() || submitting}
                    onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : handleSubmit()}>
                    {submitting ? 'Sending…' : step === STEPS.length - 1 ? 'Submit Request' : 'Continue →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="portfolio-section" ref={portfolioRef}>
        <div className="sec-tag"><div className="sec-tag-line" /><span>Portfolio</span></div>
        <h2 className="sec-title">Our Story &amp;<br />Credits</h2>
        <div className="portfolio-about">
          <div className="portfolio-about-text">
            <p>
              Just-In Time Catering and Events Ltd. is a professional mobile catering service
              specializing in the Hollywood North film and television industry, with expanded
              operations supporting large-scale events such as music festivals, weddings, and
              specialty culinary experiences.
            </p>
            <p>
              Established quitely recently, we've quickly built a strong reputation for delivering
              high-quality food service under the fast-paced demands of film sets and large
              events — always on time, always on standard.
            </p>
            <div className="portfolio-badge-row">
              <span className="portfolio-badge"><span className="portfolio-badge-dot" />Teamsters Local 155</span>
              <span className="portfolio-badge"><span className="portfolio-badge-dot" />ACFC Member</span>
              <span className="portfolio-badge"><span className="portfolio-badge-dot" />Est. 2022</span>
            </div>
          </div>
          <div className="portfolio-meta">
            <div className="portfolio-meta-card">
              <div className="portfolio-meta-label">Where We Operate</div>
              <ul><li>In Vancouver</li><li>Throughout British Columbia</li></ul>
            </div>
            <div className="portfolio-meta-card">
              <div className="portfolio-meta-label">Union Standards</div>
              <p>We operate with full union standards, reliability, and production-level efficiency — trusted by productions across BC.</p>
            </div>
          </div>
        </div>
        <div className="portfolio-credits-wrap">
          <div className="portfolio-credits-col">
            <h4>🎬 Film &amp; Television Credits</h4>
            <div className="credit-list">
              {FILM_CREDITS.map((c, i) => (
                <div key={i} className="credit-item">
                  <span className="credit-item-title">{c.title}</span>
                  <span className="credit-item-type">{c.type}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="portfolio-credits-col">
            <h4>🎵 Live &amp; Special Events</h4>
            <div className="credit-list">
              {LIVE_EVENTS.map((c, i) => (
                <div key={i} className="credit-item credit-item-live">
                  <span className="credit-item-title">{c.title}</span>
                  <span className="credit-item-type">{c.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <span className="ft-brand">Just<span>In</span>Time Catering</span>
          <div className="ft-socials">
            <a href="https://www.instagram.com/justintimemobilecateringbc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="ft-soc" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="http://www.justintime.business/" target="_blank" rel="noopener noreferrer" className="ft-soc" aria-label="Website">
              <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
          </div>
        </div>
        <div className="ft-col">
          <h5>Contact</h5>
          <a href="mailto:justintimefundining@gmail.com" className="ft-contact-item">
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            justintimefundining@gmail.com
          </a>
          <a href="tel:+12368630707" className="ft-contact-item">
            <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.27-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            236-863-0707
          </a>
        </div>
        <div className="ft-col">
          <h5>Services</h5>
          <p>Film Crew Catering</p>
          <p>Corporate Events</p>
          <p>Festival Catering</p>
          <p>Private Parties</p>
        </div>
      </footer>
      <div className="ft-bar">
        <p>© 2026 Just In Time Catering Inc. All rights reserved.</p>
        <p>Vancouver, Canada</p>
      </div>
    </>
  )
}