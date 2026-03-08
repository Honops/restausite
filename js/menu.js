// ===== menu.js =====
const menuContainer = document.getElementById('menuContainer');

if(menuContainer){

  async function loadMenu(){
    menuContainer.innerHTML = '<p>Chargement du menu...</p>';

    try{
      // Lecture du menu depuis JSON local (ou tu pourras remplacer par Firebase plus tard)
      const response = await fetch('data/menu.json');
      const menuData = await response.json();

      menuContainer.innerHTML = ''; // vider le container avant affichage

      // Parcours catégories
      for(const category of ['entree','plat','dessert','promo']){
        const items = menuData[category];
        if(!items || items.length === 0) continue;

        const catDiv = document.createElement('div');
        catDiv.classList.add('menu-category');
        catDiv.innerHTML = `<h3>${category.toUpperCase()}</h3>`;

        items.forEach(item=>{
          const itemDiv = document.createElement('div');
          itemDiv.classList.add('menu-item');

          if(item.type === 'image'){
            itemDiv.innerHTML = `
              <img src="${item.mediaUrl}" alt="${item.name}" class="menu-media">
              <p>${item.name} - ${item.price.toFixed(2)} €</p>
            `;
          } else {
            itemDiv.innerHTML = `
              <video src="${item.mediaUrl}" controls class="menu-media"></video>
              <p>${item.name} - ${item.price.toFixed(2)} €</p>
            `;
          }

          catDiv.appendChild(itemDiv);
        });

        menuContainer.appendChild(catDiv);
      }

      // ===== AGRANDIR LES MÉDIAS AU CLIC =====
      document.querySelectorAll('.menu-media').forEach(media=>{
        media.addEventListener('click', ()=>{
          const overlay = document.createElement('div');
          overlay.classList.add('overlay');
          overlay.innerHTML = `<div class="overlay-content">${media.outerHTML}</div>`;
          document.body.appendChild(overlay);
          overlay.addEventListener('click', ()=> overlay.remove());
        });
      });

    } catch(error){
      console.error('Erreur chargement menu:', error);
      menuContainer.innerHTML = '<p>Erreur lors du chargement du menu.</p>';
    }
  }

  window.addEventListener('load', loadMenu);
}
