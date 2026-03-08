// menu.js

// Exemple: ajout dynamique des plats
const menuData = {
  entrees: [
    {name: "Salade Méditerranéenne", img: "assets/images/menu/entree1.jpg"},
    {name: "Soupe de légumes", img: "assets/images/menu/entree2.jpg"}
  ],
  plats: [
    {name: "Poulet rôti", img: "assets/images/menu/plat1.jpg"},
    {name: "Poisson grillé", img: "assets/images/menu/plat2.jpg"}
  ],
  desserts: [
    {name: "Tiramisu", img: "assets/images/menu/dessert1.jpg"},
    {name: "Crème brûlée", img: "assets/images/menu/dessert2.jpg"}
  ],
  boissons: [
    {name: "Jus de fruits", img: "assets/images/menu/boisson1.jpg"},
    {name: "Cocktail maison", img: "assets/images/menu/boisson2.jpg"}
  ]
};

// fonction pour injecter dans chaque section
Object.keys(menuData).forEach(sectionId => {
  const container = document.querySelector(`#${sectionId} .images`);
  const list = document.querySelector(`#${sectionId} .plats`);
  
  menuData[sectionId].forEach(item => {
    // ajout image
    const imgEl = document.createElement('img');
    imgEl.src = item.img;
    imgEl.alt = item.name;
    container.appendChild(imgEl);

    // ajout nom plat
    const li = document.createElement('li');
    li.textContent = item.name;
    list.appendChild(li);
  });
});
