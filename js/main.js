// ===== main.js =====

// === HEADER SCROLL (apparence seulement) ===
window.addEventListener('scroll', () => {
  const header = document.querySelector('.nav-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled'); // tu peux changer couleur, ombre, etc. en CSS
  } else {
    header.classList.remove('scrolled');
  }
});

// === MENU BURGER (OPTIONNEL) ===
const burger = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

if (burger && navMenu) {
  burger.addEventListener('click', () => {
    navMenu.classList.toggle('active'); // juste visible ou caché en mobile
  });
}

// === LANGUE DU VISITEUR ===
const userLang = navigator.language || navigator.userLanguage; // "fr-FR" ou "en-US"
const lang = userLang.split('-')[0]; // "fr" ou "en"

const translations = {
  fr: {
    welcome: "Bienvenue au Restaurant",
    description: "Découvrez notre cuisine méditerranéenne.",
    menuBtn: "Voir le menu",
    reserveTitle: "Réserver une table"
  },
  en: {
    welcome: "Welcome to the Restaurant",
    description: "Discover our Mediterranean cuisine.",
    menuBtn: "See the menu",
    reserveTitle: "Book a table"
  }
};

function applyLanguage(lang) {
  const t = translations[lang] || translations['en'];
  const heroTitle = document.querySelector('.hero-intro h2');
  const heroDesc = document.querySelector('.hero-intro p');
  const heroBtn = document.querySelector('.hero-intro .btn');
  const reserveH2 = document.querySelector('#reservationPage h2');

  if (heroTitle) heroTitle.textContent = t.welcome;
  if (heroDesc) heroDesc.textContent = t.description;
  if (heroBtn) heroBtn.textContent = t.menuBtn;
  if (reserveH2) reserveH2.textContent = t.reserveTitle;
}

applyLanguage(lang);

// === MODE NUIT AUTOMATIQUE ===
const body = document.body;
const hour = new Date().getHours();

if (hour >= 19 || hour < 7) {
  body.classList.add('night-mode'); // CSS gère le fond et couleurs
} else {
  body.classList.add('day-mode'); // CSS gère le fond et couleurs
}
