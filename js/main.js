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
