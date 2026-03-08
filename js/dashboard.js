const serviceForm = document.getElementById('serviceForm');
const menuDashboard = document.getElementById('menuDashboard');

const categoryLimits = {
  entree: { images: 3, videos: 1 },
  plat: { images: 3, videos: 1 },
  dessert: { images: 3, videos: 1 },
  promo: { images: 4, videos: 2 }
};

// ===== AJOUT / REMPLACEMENT =====
if(serviceForm){
  serviceForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const name = document.getElementById('serviceName').value.trim();
    const price = parseFloat(document.getElementById('servicePrice').value);
    const category = document.getElementById('serviceCategory').value;
    const file = document.getElementById('serviceMedia').files[0];
    const type = document.getElementById('serviceType').value;

    if(!name || !price || !category || !file) {
      alert('Remplissez tous les champs');
      return;
    }

    try {
      // Vérifier limites
      const snapshot = await db.collection('services')
        .where('category','==', category)
        .where('type','==', type)
        .get();

      if(snapshot.size >= categoryLimits[category][type + 's']){
        alert(`Limite atteinte pour ${type} dans la catégorie ${category}`);
        return;
      }

      // Upload Storage
      const fileName = Date.now() + "_" + file.name;
      const storageRef = storage.ref(`services/${fileName}`);
      await storageRef.put(file);
      const mediaUrl = await storageRef.getDownloadURL();

      // Ajouter Firestore
      await db.collection('services').add({
        name, price, category, mediaUrl, type,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert('Plat ajouté !');
      serviceForm.reset();
      loadMenuDashboard();

    } catch(error){
      console.error(error);
      alert('Erreur lors de l’ajout');
    }
  });
}

// ===== CHARGER LE DASHBOARD =====
async function loadMenuDashboard(){
  menuDashboard.innerHTML = '<p>Chargement...</p>';

  try{
    const snapshot = await db.collection('services').orderBy('createdAt','desc').get();
    menuDashboard.innerHTML = '';

    if(snapshot.empty){
      menuDashboard.innerHTML = '<p>Menu vide pour le moment.</p>';
      return;
    }

    const categories = { entree: [], plat: [], dessert: [], promo: [] };
    snapshot.forEach(doc=>{
      const data = doc.data();
      if(categories[data.category]){
        categories[data.category].push(data);
      }
    });

    for(const cat in categories){
      const catDiv = document.createElement('div');
      catDiv.innerHTML = `<h3>${cat.toUpperCase()}</h3>`;
      categories[cat].forEach(item=>{
        const div = document.createElement('div');
        div.classList.add('menu-item');

        if(item.type === 'image'){
          div.innerHTML = `<img src="${item.mediaUrl}" alt="${item.name}"><p>${item.name} - ${item.price.toFixed(2)} €</p>`;
        } else {
          div.innerHTML = `<video src="${item.mediaUrl}" controls></video><p>${item.name} - ${item.price.toFixed(2)} €</p>`;
        }

        catDiv.appendChild(div);
      });

      menuDashboard.appendChild(catDiv);
    }

  } catch(error){
    console.error(error);
    menuDashboard.innerHTML = '<p>Erreur chargement dashboard.</p>';
  }
}

window.addEventListener('load', loadMenuDashboard);
