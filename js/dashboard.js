// ===== INITIALISATION =====
const serviceForm = document.getElementById('serviceForm');
const dashboardContainer = document.getElementById('dashboardServicesContainer');
const reservationsTable = document.querySelector('#reservationsTable tbody');

const categoryLimits = {
  entree: { images: 3, videos: 1 },
  plat: { images: 3, videos: 1 },
  dessert: { images: 3, videos: 1 },
  promo: { images: 4, videos: 2 }
};

// ===== AJOUT D'UN PLAT =====
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
      // Vérifier limites médias
      const snapshot = await db.collection('services')
        .where('category','==', category)
        .where('type','==', type)
        .get();

      if(snapshot.size >= categoryLimits[category][type+'s']){
        alert(`Limite atteinte pour ${type} dans la catégorie ${category}`);
        return;
      }

      // Upload sur Firebase Storage
      const fileName = Date.now() + "_" + file.name;
      const storageRef = storage.ref(`services/${fileName}`);
      await storageRef.put(file);
      const mediaUrl = await storageRef.getDownloadURL();

      // Ajouter dans Firestore
      await db.collection('services').add({
        name, price, category, mediaUrl, type,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      alert('Plat ajouté !');
      serviceForm.reset();
      loadDashboardServices();
      loadReservations();

    } catch(error){
      console.error(error);
      alert('Erreur lors de l’ajout');
    }
  });
}

// ===== CHARGER PLATS POUR DASHBOARD =====
async function loadDashboardServices(){
  if(!dashboardContainer) return;
  dashboardContainer.innerHTML = '<p>Chargement des plats...</p>';

  try {
    const snapshot = await db.collection('services').orderBy('createdAt','desc').get();
    if(snapshot.empty){
      dashboardContainer.innerHTML = '<p>Aucun plat pour le moment.</p>';
      return;
    }

    dashboardContainer.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const card = document.createElement('div');
      card.classList.add('service-card');
      card.dataset.id = doc.id;

      if(data.type === 'image'){
        card.innerHTML = `<img src="${data.mediaUrl}" alt="${data.name}">`;
      } else {
        card.innerHTML = `<video src="${data.mediaUrl}" controls></video>`;
      }

      card.innerHTML += `
        <p>${data.name} - ${data.price.toFixed(2)} €</p>
        <button class="btn-card btn-edit">Modifier</button>
        <button class="btn-card btn-delete">Supprimer</button>
      `;

      dashboardContainer.appendChild(card);

      // ===== SUPPRIMER PLAT =====
      card.querySelector('.btn-delete').addEventListener('click', async ()=>{
        if(confirm('Supprimer ce plat ?')){
          // Supprimer fichier Storage
          const fileRef = storage.refFromURL(data.mediaUrl);
          await fileRef.delete();
          // Supprimer Firestore
          await db.collection('services').doc(doc.id).delete();
          loadDashboardServices();
        }
      });

      // ===== MODIFIER PLAT =====
      card.querySelector('.btn-edit').addEventListener('click', async ()=>{
        const newName = prompt('Nom du plat', data.name);
        const newPrice = parseFloat(prompt('Prix du plat', data.price));
        const newFile = prompt('Voulez-vous changer le média ? Oui/Non', 'Non');

        if(newName && !isNaN(newPrice)){
          let updateData = { name: newName, price: newPrice };

          if(newFile.toLowerCase() === 'oui'){
            // Supprimer ancien fichier
            const fileRef = storage.refFromURL(data.mediaUrl);
            await fileRef.delete();

            // Sélection fichier nouveau
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = data.type==='image' ? 'image/*' : 'video/*';
            fileInput.click();
            fileInput.addEventListener('change', async ()=>{
              const file = fileInput.files[0];
              const fileName = Date.now() + "_" + file.name;
              const storageRef = storage.ref(`services/${fileName}`);
              await storageRef.put(file);
              const mediaUrl = await storageRef.getDownloadURL();
              updateData.mediaUrl = mediaUrl;
              await db.collection('services').doc(doc.id).update(updateData);
              loadDashboardServices();
            });
          } else {
            await db.collection('services').doc(doc.id).update(updateData);
            loadDashboardServices();
          }
        }
      });

    });

  } catch(error){
    console.error('Erreur dashboard services:', error);
    dashboardContainer.innerHTML = '<p>Erreur chargement plats.</p>';
  }
}

// ===== CHARGER RÉSERVATIONS =====
async function loadReservations(){
  if(!reservationsTable) return;
  reservationsTable.innerHTML = '';

  const snapshot = await db.collection('reservations').orderBy('date','asc').get();
  snapshot.forEach(doc => {
    const data = doc.data();
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${data.name}</td>
      <td>${data.phone}</td>
      <td>${data.date}</td>
      <td>${data.time}</td>
      <td><button class="delete-btn" data-id="${doc.id}">Supprimer</button></td>
    `;
    reservationsTable.appendChild(row);
  });

  document.querySelectorAll('.delete-btn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const id = btn.dataset.id;
      if(confirm('Supprimer cette réservation ?')){
        await db.collection('reservations').doc(id).delete();
        loadReservations();
      }
    });
  });
}

// ===== INITIALISATION =====
window.addEventListener('load', ()=>{
  loadDashboardServices();
  loadReservations();
});
