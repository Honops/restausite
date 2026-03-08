// Scroll smooth pour ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Animation apparition sections au scroll
const sections = document.querySelectorAll('section');
function revealOnScroll(){
  const trigger = window.innerHeight * 0.85;
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if(top < trigger){
      sec.style.opacity = 1;
      sec.style.transform = 'translateY(0)';
      sec.style.transition = 'all 0.8s ease-out';
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
