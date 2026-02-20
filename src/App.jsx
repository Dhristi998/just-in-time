import { useState, useRef } from 'react'

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxQ3pZJ9pPas7i7CD4Q587iCViF2OM9bb7tNXU-S42kdve7UZQgUezf7MNdGHZdeP11/exec'

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

const MENU_ITEMS = [
  { id:1,  name:'Breakfast Wraps',    cat:'breakfast' },
  { id:2,  name:'Sandwiches',    cat:'breakfast' },
  { id:3,  name:'Eggs (any style)',   cat:'breakfast' },
  { id:4,  name:'Varieties of Omlettes',       cat:'breakfast' },
  { id:5,  name:'Waffles', cat:'breakfast' },
  { id:6,  name:'Pancakes',   cat:'breakfast' },
  { id:7,  name:'French Toast',   cat:'breakfast' },
  { id:8,  name:'Hot Table -> Hash Browns, Sausage & Bacons, Healthy Snacks, Coffee station',     cat:'breakfast' },
  { id:9,  name:'Salad Bar, Caesar Salad & 3 Chefs Choice Salad',        cat:'lunch'     },
  { id:10, name:'Soup of the Day (chefs choice)',    cat:'lunch'     },
  { id:11, name:'Hot Buffet-> 2 Non-Vegetarian Proteins',         cat:'lunch'     },
  { id:12, name:'Hot Buffet-> 1 Vegetarian Protein', cat:'lunch'     },
  { id:13, name:'Hot Buffet-> 2 Vegetables and 2 Different Sides',   cat:'lunch'     },
  { id:14, name:"Varieties of Desserts",     cat:'lunch'     },
]

const GALLERY = [
  { id:1, src:'/1 (4).jpeg', alt:'Grilled food', span:'tall' },
  { id:2, src:'/1 (2).jpeg', alt:'Food spread',  span:'wide' },
  { id:3, src:'/2.jpeg',     alt:'Pizza',         span:''     },
  { id:4, src:'/1 (5).jpeg', alt:'Pancakes',      span:''     },
  { id:5, src:'/1 (3).jpeg', alt:'Dishes',        span:'wide' },
  { id:6, src:'/1 (9).jpeg', alt:'Fine dining',   span:'tall' },
  { id:7, src:'/1 (7).jpeg', alt:'Food truck',    span:''     },
  { id:8, src:'/1.jpeg',     alt:'Waffles',       span:''     },
]

const BUBBLES = [
  { src:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=85' },
  { src:'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500&q=85' },
  { src:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&q=85'    },
  { src:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=85' },
  { src:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=85' },
]

const STEPS = ['Service', 'Cuisine', 'Meal Prefs', 'Guests', 'Date & Time', 'Location', 'Budget', 'Contact']

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
  border: 1.5px solid #2d6a3f;
  background: #222; display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; color: #4a9e64; font-weight: 700; overflow: hidden;
}
.nav-logo-img img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.nav-logo-text { font-size: 1.3rem; font-weight: 600; letter-spacing: 0.01em; color: #f2f2f2; }
.nav-logo-text span { color: #4a9e64; }
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
  background: #2d6a3f; color: #fff; border: none;
  padding: 20px 32px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 1.1rem; letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; transition: background 0.2s;
}
.drawer-cta:hover { background: #37854f; }

.btn-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: #2d6a3f; color: #fff; border: none;
  padding: 17px 42px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-weight: 600;
  font-size: 1.05rem; letter-spacing: 0.06em; text-transform: uppercase;
  cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}
.btn-pill:hover { background: #37854f; transform: translateY(-3px); box-shadow: 0 12px 36px rgba(45,106,63,0.4); }
.btn-pill:active { transform: scale(0.96); }
.btn-pill:disabled { background: #3a3a3a; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-pill-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: #b0b0b0;
  border: 1.5px solid #2e2e2e; padding: 17px 42px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-weight: 500;
  font-size: 1.05rem; letter-spacing: 0.06em; text-transform: uppercase;
  cursor: pointer; transition: border-color 0.2s, color 0.2s, transform 0.15s;
}
.btn-pill-ghost:hover { border-color: #b0b0b0; color: #f2f2f2; transform: translateY(-3px); }
.btn-pill-ghost:active { transform: scale(0.96); }

.hero {
  min-height: 100vh; position: relative; overflow: hidden;
  display: flex; align-items: center; padding: 110px 64px 72px;
}
.hero-bg {
  position: absolute; inset: 0; z-index: 0;
  background:
    linear-gradient(105deg, rgba(17,17,17,0.97) 36%, rgba(17,17,17,0.62) 65%, rgba(17,17,17,0.18) 100%),
    url('/truck.jpeg') right center / cover no-repeat;
}
.hero-content { position: relative; z-index: 1; max-width: 620px; }
.hero-chip {
  display: inline-flex; align-items: center; gap: 10px;
  background: rgba(45,106,63,0.18); border: 1px solid rgba(74,158,100,0.3);
  color: #5eba78; font-size: 0.82rem; font-weight: 500;
  letter-spacing: 0.18em; text-transform: uppercase;
  padding: 8px 18px; border-radius: 100px; margin-bottom: 30px;
}
.hero-chip-dot { width: 7px; height: 7px; border-radius: 50%; background: #5eba78; }
.hero h1 {
  font-size: clamp(3rem, 5.5vw, 5rem);
  font-weight: 700; line-height: 1.08; color: #f2f2f2;
  margin-bottom: 22px; letter-spacing: -0.02em;
}
.hero h1 em { color: #4a9e64; font-style: normal; }
.hero-sub {
  font-size: 1.15rem; color: #757575; line-height: 1.85;
  max-width: 460px; margin-bottom: 44px; font-weight: 300;
}
.hero-btns { display: flex; gap: 16px; flex-wrap: wrap; }

.sec-tag { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.sec-tag-line { width: 32px; height: 1.5px; background: #2d6a3f; }
.sec-tag span { font-size: 0.8rem; letter-spacing: 0.22em; text-transform: uppercase; color: #4a9e64; font-weight: 500; }
.sec-title {
  font-size: clamp(2.4rem, 4.5vw, 3.8rem); font-weight: 700; color: #f2f2f2;
  letter-spacing: -0.02em; line-height: 1.08; margin-bottom: 18px;
}
.sec-sub { font-size: 1.05rem; color: #757575; line-height: 1.85; font-weight: 300; max-width: 520px; margin-bottom: 60px; }

.gallery-section { padding: 110px 64px; background: #151515; }
.gallery-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 260px; gap: 14px;
}
.gallery-item {
  border-radius: 14px; overflow: hidden; position: relative; cursor: pointer;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.gallery-item:hover { transform: scale(1.02); box-shadow: 0 16px 48px rgba(0,0,0,0.6); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
.gallery-item:hover img { transform: scale(1.06); }
.gallery-item.tall { grid-row: span 2; }
.gallery-item.wide { grid-column: span 2; }
.gallery-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(17,17,17,0.55) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.3s;
}
.gallery-item:hover .gallery-overlay { opacity: 1; }

.film-section { padding: 110px 64px; background: #111111; }
.film-layout { display: grid; grid-template-columns: 1fr 1.15fr; gap: 80px; align-items: start; }

.bubbles-wrap {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 20px; align-items: start; padding-top: 20px;
}
.bubble {
  border-radius: 50%; overflow: hidden;
  border: 2.5px solid rgba(45,106,63,0.3);
  box-shadow: 0 12px 40px rgba(0,0,0,0.55);
  aspect-ratio: 1; width: 100%;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.bubble:hover {
  transform: scale(1.05) translateY(-4px);
  box-shadow: 0 20px 56px rgba(45,106,63,0.25);
  border-color: rgba(74,158,100,0.6);
}
.bubble img { width: 100%; height: 100%; object-fit: cover; display: block; }
.bubble.pulse { animation: bubblePulse 5s ease-in-out infinite; }
@keyframes bubblePulse {
  0%,100% { box-shadow: 0 12px 40px rgba(0,0,0,0.55); }
  50%      { box-shadow: 0 12px 64px rgba(45,106,63,0.22); }
}
.bubble-center-row { grid-column: 1 / -1; display: flex; justify-content: center; }
.bubble-center-row .bubble { width: 55%; }

.film-filter { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
.ftab {
  padding: 10px 24px; border-radius: 100px; border: 1.5px solid #2e2e2e;
  background: transparent; color: #757575; font-family: 'Outfit', sans-serif;
  font-size: 0.9rem; font-weight: 400; letter-spacing: 0.08em; text-transform: uppercase;
  cursor: pointer; transition: all 0.2s;
}
.ftab.on { background: #2d6a3f; border-color: #2d6a3f; color: #fff; }
.ftab:not(.on):hover { border-color: #757575; color: #b0b0b0; }

.film-cards { display: flex; flex-direction: column; gap: 4px; }
.film-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 26px; border-radius: 14px;
  background: #222222; border: 1px solid #2e2e2e;
  transition: border-color 0.2s, background 0.2s;
}
.film-card:hover { border-color: rgba(45,106,63,0.4); background: rgba(34,34,34,0.95); }
.film-card-name { font-size: 1.1rem; font-weight: 400; color: #b0b0b0; }
.film-card-cat {
  font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: #2d6a3f; font-weight: 500;
  background: rgba(45,106,63,0.14); border: 1px solid rgba(45,106,63,0.28);
  padding: 5px 14px; border-radius: 100px;
}

.book-section { padding: 110px 64px; background: #151515; }
.book-center { max-width: 780px; margin: 0 auto; }
.wiz-card {
  background: #222222; border: 1px solid #2e2e2e;
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
}
.wiz-prog { height: 3px; background: #2e2e2e; }
.wiz-prog-fill { height: 100%; background: #2d6a3f; transition: width 0.4s ease; }
.wiz-head {
  padding: 22px 44px; border-bottom: 1px solid #2e2e2e;
  display: flex; align-items: center; justify-content: space-between;
}
.wiz-step-info { font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase; color: #404040; }
.wiz-step-info strong { color: #4a9e64; font-weight: 600; }
.wiz-step-dots { display: flex; gap: 7px; }
.wiz-dot { width: 8px; height: 8px; border-radius: 50%; background: #2e2e2e; transition: background 0.3s; }
.wiz-dot.done { background: rgba(45,106,63,0.5); }
.wiz-dot.now  { background: #2d6a3f; }

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
.opt.on { border-color: #2d6a3f; background: rgba(45,106,63,0.1); transform: translateY(-3px); }
.opt-ico { font-size: 2.2rem; line-height: 1; }
.opt-lbl { font-size: 0.95rem; font-weight: 400; color: #757575; }
.opt.on .opt-lbl { color: #f2f2f2; }

.flabel { display: block; font-size: 0.78rem; letter-spacing: 0.16em; text-transform: uppercase; color: #404040; font-weight: 500; margin-bottom: 10px; }
.inp {
  width: 100%; background: #1e1e1e; border: 1px solid #2e2e2e;
  border-radius: 12px; padding: 16px 18px; color: #f2f2f2;
  font-family: 'Outfit', sans-serif; font-size: 1.05rem; font-weight: 300;
  outline: none; transition: border-color 0.2s; appearance: none;
}
.inp:focus { border-color: #4a9e64; }
.inp::placeholder { color: #404040; }
.inp[readonly] { cursor: default; opacity: 0.75; }

.tog-row { display: flex; gap: 8px; margin-bottom: 22px; }
.tog {
  padding: 10px 24px; border-radius: 100px; border: 1.5px solid #2e2e2e;
  background: transparent; color: #757575;
  font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 400;
  letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; transition: all 0.2s;
}
.tog.on { background: #2d6a3f; border-color: #2d6a3f; color: #fff; }

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
  width: 90px; height: 90px; border-radius: 50%;
  border: 2px solid #2d6a3f;
  display: flex; align-items: center; justify-content: center;
  font-size: 2.4rem; margin: 0 auto 32px;
  background: rgba(45,106,63,0.1);
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

footer {
  background: #111111; border-top: 1px solid #2e2e2e;
  padding: 80px 64px 52px;
  display: grid; grid-template-columns: 1.8fr 1fr 1fr; gap: 64px;
}
.ft-brand { font-size: 1.4rem; font-weight: 600; color: #f2f2f2; margin-bottom: 16px; display: block; }
.ft-brand span { color: #4a9e64; }
.ft-desc { font-size: 0.95rem; color: #757575; line-height: 1.85; max-width: 280px; margin-bottom: 28px; font-weight: 300; }
.ft-socials { display: flex; gap: 10px; }
.ft-soc {
  width: 42px; height: 42px; border-radius: 50%;
  border: 1px solid #2e2e2e; display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem; color: #404040; cursor: pointer; transition: border-color 0.2s, color 0.2s;
}
.ft-soc:hover { border-color: #2d6a3f; color: #4a9e64; }
.ft-col h5 { font-size: 0.78rem; letter-spacing: 0.18em; text-transform: uppercase; color: #4a9e64; font-weight: 500; margin-bottom: 22px; }
.ft-col p { font-size: 0.95rem; color: #757575; margin-bottom: 12px; font-weight: 300; }
.ft-bar {
  background: #111111; border-top: 1px solid rgba(46,46,46,0.6);
  padding: 22px 64px; display: flex; justify-content: space-between;
}
.ft-bar p { font-size: 0.82rem; color: #404040; }

@media (max-width: 1200px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 1024px) {
  .nav { padding: 0 40px; }
  .film-section, .gallery-section, .book-section, .hero { padding-left: 40px; padding-right: 40px; }
  footer { padding-left: 40px; padding-right: 40px; }
  .ft-bar { padding-left: 40px; padding-right: 40px; }
}
@media (max-width: 900px) {
  .film-layout { grid-template-columns: 1fr; gap: 48px; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .gallery-item.tall { grid-row: span 1; }
  .gallery-item.wide { grid-column: span 1; }
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
  .film-section, .gallery-section, .book-section { padding: 72px 20px; }
  .bubbles-wrap { grid-template-columns: 1fr 1fr; gap: 14px; }
  .bubble-center-row .bubble { width: 70%; }
  .gallery-grid { grid-template-columns: 1fr; grid-auto-rows: 240px; }
  .gallery-item.tall, .gallery-item.wide { grid-row: span 1; grid-column: span 1; }
  .wiz-body { padding: 28px 20px 24px; }
  .wiz-head { padding: 16px 20px; }
  .book-center { max-width: 100%; }
  .opts { grid-template-columns: repeat(2, 1fr); }
  footer { grid-template-columns: 1fr; gap: 44px; padding: 56px 20px 36px; }
  .ft-bar { padding: 18px 20px; flex-direction: column; gap: 6px; text-align: center; }
}
@media (max-width: 480px) {
  .hero h1 { font-size: 2.6rem; }
  .bubbles-wrap { grid-template-columns: 1fr 1fr; gap: 12px; }
}
`

export default function App() {
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [filmFilter, setFilmFilter] = useState('all')
  const [navPop,     setNavPop]     = useState('')
  const [step,       setStep]       = useState(0)
  const [done,       setDone]       = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    service:  '',
    cuisines: [],
    meal:     [],
    style:    [],
    guests:   '',
    dateMode: 'single',
    date:     '',
    dateEnd:  '',
    time:     '',
    province: 'British Columbia',
    city:     '',
    budget:   '',
    name:     '',
    email:    '',
    phone:    '',
  })

  const galleryRef = useRef(null)
  const filmRef    = useRef(null)
  const bookRef    = useRef(null)

  const scrollTo = (ref, id) => {
    setNavPop(id)
    setTimeout(() => setNavPop(''), 420)
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const items = filmFilter === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(i => i.cat === filmFilter)

  const pct = (step / (STEPS.length - 1)) * 100
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const togField = (field, val) => setForm(f => ({
    ...f,
    [field]: f[field].includes(val)
      ? f[field].filter(x => x !== val)
      : [...f[field], val],
  }))

  const canNext = () => {
    if (step === 0) return !!form.service
    if (step === 1) return form.cuisines.length > 0
    if (step === 2) return form.meal.length > 0 && form.style.length > 0
    if (step === 3) return parseInt(form.guests) > 0
    if (step === 4) return !!form.date && !!form.time
    if (step === 5) return !!form.city
    if (step === 6) return parseInt(form.budget) > 0
    if (step === 7) return !!form.name && !!form.email && !!form.phone
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await submitToSheets({
      ...form,
      meal:     form.meal.join(', '),
      style:    form.style.join(', '),
      cuisines: form.cuisines.join(', '),
    })
    setSubmitting(false)
    setDone(true)
  }

  const Opt = ({ icon, label, val, field }) => {
    const on = form[field] === val
    return (
      <div className={`opt${on ? ' on' : ''}`} onClick={() => set(field, val)}>
        <span className="opt-ico">{icon}</span>
        <span className="opt-lbl">{label}</span>
      </div>
    )
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

  return (
    <>
      <style>{css}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <button className={`burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className="nav-logo-wrap"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="nav-logo-img">
            <img src="/logo (1).jpeg" alt="JIT"
              onError={e => { e.target.style.display = 'none' }} />
          </div>
          <div className="nav-logo-text">Just<span>In</span>Time</div>
        </div>
        <div className="nav-right">
          <button className={`nav-link${navPop === 'film' ? ' pop' : ''}`}
            onClick={() => scrollTo(filmRef, 'film')}>Film Catering</button>
          <button className={`nav-link${navPop === 'book' ? ' pop' : ''}`}
            onClick={() => scrollTo(bookRef, 'book')}>Book a Truck</button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div className={`drawer${menuOpen ? ' open' : ''}`}>
        <button className="drawer-link" onClick={() => scrollTo(filmRef, 'film')}>Film Catering</button>
        <button className="drawer-link" onClick={() => scrollTo(bookRef, 'book')}>Book a Truck</button>
        <button className="drawer-cta"  onClick={() => scrollTo(bookRef, 'book')}>Reserve Now</button>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-chip">
            <div className="hero-chip-dot" />
            Film &amp; Event Catering · Canada
          </div>
          <h1>Fueling Crews<br />&amp; <em>Events,</em><br />Just In Time</h1>
          <p className="hero-sub">
            Premium food truck catering for film productions, corporate events,
            and festivals. Fresh, reliable, always on cue.
          </p>
          <div className="hero-btns">
            <button className="btn-pill"       onClick={() => scrollTo(bookRef, 'book')}>Book a Truck</button>
            <button className="btn-pill-ghost" onClick={() => scrollTo(filmRef, 'film')}>Film Catering ↓</button>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery-section" ref={galleryRef}>
        <div className="sec-tag"><div className="sec-tag-line" /><span>Gallery</span></div>
        <h2 className="sec-title">From the Field</h2>
        <p className="sec-sub">
          A look at what we bring to every set, event, and festival — real food, real moments.
        </p>
        <div className="gallery-grid">
          {GALLERY.map(img => (
            <div key={img.id} className={`gallery-item${img.span ? ' ' + img.span : ''}`}>
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
        <p className="sec-sub">
          From pre-dawn breakfasts on early call mornings to full spread lunches
          for 200+ crew. We've got every shift covered.
        </p>
        <div className="film-layout">
          <div className="bubbles-wrap">
            {BUBBLES.slice(0, 4).map((b, i) => (
              <div key={i} className={`bubble${i === 0 ? ' pulse' : ''}`}>
                <img src={b.src} alt="food" loading="lazy" />
              </div>
            ))}
            <div className="bubble-center-row">
              <div className="bubble">
                <img src={BUBBLES[4].src} alt="food" loading="lazy" />
              </div>
            </div>
          </div>
          <div>
            <div className="film-filter">
              {['all', 'breakfast', 'lunch'].map(f => (
                <button key={f} className={`ftab${filmFilter === f ? ' on' : ''}`}
                  onClick={() => setFilmFilter(f)}>
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="film-cards">
              {items.map(item => (
                <div key={item.id} className="film-card">
                  <span className="film-card-name">{item.name}</span>
                  <span className="film-card-cat">{item.cat}</span>
                </div>
              ))}
            </div>
          </div>
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
            <div className="wiz-prog">
              <div className="wiz-prog-fill" style={{ width: done ? '100%' : `${pct}%` }} />
            </div>

            {!done && (
              <div className="wiz-head">
                <span className="wiz-step-info">
                  Step <strong>{step + 1}</strong> of {STEPS.length} — {STEPS[step]}
                </span>
                <div className="wiz-step-dots">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`wiz-dot${i < step ? ' done' : i === step ? ' now' : ''}`} />
                  ))}
                </div>
              </div>
            )}

            <div className="wiz-body">

              {/* CONFIRMATION */}
              {done && (
                <div className="confirm-wrap">
                  <div className="confirm-ring">✓</div>
                  <h3 className="confirm-h">Request Received</h3>
                  <p className="confirm-p">
                    Thank you, <strong>{form.name}</strong>.<br />
                    We'll reach out to <strong>{form.email}</strong> within 24 hours<br />
                    to confirm your booking for <strong>{form.date}</strong> at <strong>{form.time}</strong>.
                  </p>
                </div>
              )}

              {/* STEP 1 */}
              {!done && step === 0 && (
                <>
                  <h3 className="wiz-h">Service Type</h3>
                  <p className="wiz-p">How should food be served at your event?</p>
                  <div className="opts">
                    <Opt icon="🍽️" label="À La Carte" val="alacarte" field="service" />
                    <Opt icon="🥘" label="Buffet"      val="buffet"   field="service" />
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {!done && step === 1 && (
                <>
                  <h3 className="wiz-h">Cuisine</h3>
                  <p className="wiz-p">Select everything that applies — we mix and match.</p>
                  <div className="opts">
                    <OptM icon="🔥" label="BBQ"       val="bbq"       field="cuisines" />
                    <OptM icon="🍔" label="Burgers"   val="burgers"   field="cuisines" />
                    <OptM icon="🌮" label="Tacos"     val="tacos"     field="cuisines" />
                    <OptM icon="🍳" label="Breakfast" val="breakfast" field="cuisines" />
                    <OptM icon="🍰" label="Desserts"  val="desserts"  field="cuisines" />
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {!done && step === 2 && (
                <>
                  <h3 className="wiz-h">Meal Preferences</h3>
                  <p className="wiz-p">Select all that apply for both sections.</p>
                  <label className="flabel">Meal Time — select all that apply</label>
                  <div className="opts" style={{ marginBottom: 28 }}>
                    <OptM icon="🌅" label="Breakfast" val="breakfast" field="meal" />
                    <OptM icon="☀️" label="Lunch"     val="lunch"     field="meal" />
                    <OptM icon="🌙" label="Dinner"    val="dinner"    field="meal" />
                    <OptM icon="🍪" label="Dessert"   val="dessert"   field="meal" />
                  </div>
                  <label className="flabel">Serving Style — select all that apply</label>
                  <div className="opts">
                    <OptM icon="🥩" label="Main"    val="main"    field="style" />
                    <OptM icon="🥗" label="Sides"   val="sides"   field="style" />
                    <OptM icon="🥤" label="Drinks"  val="drinks"  field="style" />
                    <OptM icon="🍮" label="Dessert" val="dessert" field="style" />
                  </div>
                </>
              )}

              {/* STEP 4 */}
              {!done && step === 3 && (
                <>
                  <h3 className="wiz-h">Guest Count</h3>
                  <p className="wiz-p">How many people are you expecting?</p>
                  <label className="flabel">Number of Guests</label>
                  <input className="inp" type="number" placeholder="e.g. 75"
                    value={form.guests} onChange={e => set('guests', e.target.value)} />
                </>
              )}

              {/* STEP 5 */}
              {!done && step === 4 && (
                <>
                  <h3 className="wiz-h">Date &amp; Time</h3>
                  <p className="wiz-p">When should we show up?</p>
                  <label className="flabel">Event Duration</label>
                  <div className="tog-row">
                    {['single', 'multiple'].map(m => (
                      <button key={m} className={`tog${form.dateMode === m ? ' on' : ''}`}
                        onClick={() => set('dateMode', m)}>
                        {m === 'single' ? 'Single Day' : 'Multiple Days'}
                      </button>
                    ))}
                  </div>
                  <label className="flabel">
                    {form.dateMode === 'multiple' ? 'Start Date' : 'Event Date'}
                  </label>
                  <input className="inp" type="date" value={form.date}
                    onChange={e => set('date', e.target.value)}
                    style={{ marginBottom: 20 }} />
                  {form.dateMode === 'multiple' && (
                    <>
                      <label className="flabel">End Date</label>
                      <input className="inp" type="date" value={form.dateEnd}
                        onChange={e => set('dateEnd', e.target.value)}
                        style={{ marginBottom: 20 }} />
                    </>
                  )}
                  <label className="flabel" style={{ marginTop: 8 }}>Preferred Start Time</label>
                  <input className="inp" type="text"
                    placeholder="e.g. 7:00 AM, after 6pm, flexible..."
                    value={form.time} onChange={e => set('time', e.target.value)} />
                </>
              )}

              {/* STEP 6 */}
              {!done && step === 5 && (
                <>
                  <h3 className="wiz-h">Location</h3>
                  <p className="wiz-p">We operate across British Columbia.</p>
                  <label className="flabel">Province</label>
                  <input className="inp" value="British Columbia" readOnly
                    style={{ color: '#4a9e64', marginBottom: 20 }} />
                  <label className="flabel">City</label>
                  <input className="inp" placeholder="e.g. Vancouver, Surrey, Burnaby..."
                    value={form.city} onChange={e => set('city', e.target.value)} />
                </>
              )}

              {/* STEP 7 */}
              {!done && step === 6 && (
                <>
                  <h3 className="wiz-h">Budget</h3>
                  <p className="wiz-p">What's your approximate budget for this event?</p>
                  <label className="flabel">Estimated Budget (CAD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 16, top: '50%',
                      transform: 'translateY(-50%)', color: '#404040', fontSize: '1.1rem',
                    }}>$</span>
                    <input className="inp" type="number" placeholder="e.g. 1,500"
                      style={{ paddingLeft: 32 }}
                      value={form.budget} onChange={e => set('budget', e.target.value)} />
                  </div>
                </>
              )}

              {/* STEP 8 */}
              {!done && step === 7 && (
                <>
                  <h3 className="wiz-h">Contact Info</h3>
                  <p className="wiz-p">We'll use these to confirm your booking.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label className="flabel">Full Name</label>
                      <input className="inp" placeholder="Jane Smith"
                        value={form.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div>
                      <label className="flabel">Email Address</label>
                      <input className="inp" type="email" placeholder="jane@production.com"
                        value={form.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div>
                      <label className="flabel">Phone Number</label>
                      <input className="inp" type="tel" placeholder="+1 (604) 000-0000"
                        value={form.phone} onChange={e => set('phone', e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              {/* NAV BUTTONS */}
              {!done && (
                <div className="wiz-nav">
                  {step > 0
                    ? <button className="btn-back-wiz" onClick={() => setStep(s => s - 1)}>← Back</button>
                    : <span />
                  }
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

      {/* FOOTER */}
      <footer>
        <div>
          <span className="ft-brand">Just<span>In</span>Time Catering</span>
          <p className="ft-desc">
            Film &amp; event catering across Canada. Fresh food, reliable
            service, on every call sheet since 2018.
          </p>
          <div className="ft-socials">
            {['𝕏', 'f', 'in', '◎'].map((s, i) => (
              <div key={i} className="ft-soc">{s}</div>
            ))}
          </div>
        </div>
        <div className="ft-col">
          <h5>Contact</h5>
          <p>📍 Vancouver, BC</p>
          <p>📧 hello@justintime.ca</p>
          <p>📞 (604) 555-0192</p>
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
        <p>© 2024 Just In Time Catering Inc. All rights reserved.</p>
        <p>Vancouver, Canada</p>
      </div>
    </>
  )
}