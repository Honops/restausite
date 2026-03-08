const menuContainer = document.getElementById('menuContainer');
if(menuContainer){

  async function loadMenu(){
    menuContainer.innerHTML = '<p>Chargement du menu...</p>';

    try{
      const snapshot = await db.collection('services').orderBy('createdAt','desc').get();
      if(snapshot.empty){
        menuContainer.innerHTML = '<p>Le menu sera bientôt disponible.</p>';
        return;
      }

      // Regrouper par catégorie
      const categories = { entree: [], plat: [], dessert: [], promo: [] };
      snapshot.forEach(doc=>{
        const data = doc.data();
        if(categories[data.category]){
          categories[data.category].push(data);
        }
      });

      menuContainer.innerHTML = '';

      // Créer sections
      for(const cat in categories){
        const catDiv = document.createElement('div');
        catDiv.classList.add('menu-category');
        catDiv.innerHTML = `<h3>${cat.toUpperCase()}</h3>`;
        
        categories[cat].forEach(item=>{
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

      // Zoom au clic
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
