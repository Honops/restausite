// main.js

// Header fixe (déjà en CSS) -> ajoute une classe si on veut changer l'apparence au scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('.nav-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Menu responsive (si tu veux un bouton burger)
const burger = document.querySelector('.burger-menu'); // à créer si besoin
const navMenu = document.querySelector('.nav-menu');

if(burger){
  burger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}
// language.js

const userLang = navigator.language || navigator.userLanguage; // ex: "fr-FR" ou "en-US"
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

// Fonction pour appliquer les traductions
function applyLanguage(lang) {
  const t = translations[lang] || translations['en']; // fallback en anglais
  const heroTitle = document.querySelector('.hero-intro h2');
  const heroDesc = document.querySelector('.hero-intro p');
  const heroBtn = document.querySelector('.hero-intro .btn');
  const reserveH2 = document.querySelector('#reservationPage h2');

  if(heroTitle) heroTitle.textContent = t.welcome;
  if(heroDesc) heroDesc.textContent = t.description;
  if(heroBtn) heroBtn.textContent = t.menuBtn;
  if(reserveH2) reserveH2.textContent = t.reserveTitle;
}

applyLanguage(lang);
// theme.js

const hour = new Date().getHours();
const body = document.body;

// mode nuit entre 19h et 7h
if(hour >= 19 || hour < 7){
  body.classList.add('night-mode');
} else {
  body.classList.add('day-mode');
}
// bouton toggle à ajouter dans le header
const themeToggle = document.getElementById('themeToggle');

if(themeToggle){
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('night-mode');
    body.classList.toggle('day-mode');
  });
}
