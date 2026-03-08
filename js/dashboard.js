// ===== INITIALISATION =====
const serviceForm = document.getElementById('serviceForm');
const reservationsTable = document.querySelector('#reservationsTable tbody');

// ===== LIMITES DES MÉDIAS =====
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

      if(snapshot.size >= categoryLimits[category][type + 's']){
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
      loadReservations();
      loadServicesDashboard();

    } catch(error){
      console.error(error);
      alert('Erreur lors de l’ajout');
    }
  });
}

// ===== CHARGER LES RÉSERVATIONS =====
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

// ===== CHARGER LES MÉDIAS POUR LE DASHBOARD (OPTIONNEL) =====
async function loadServicesDashboard(){
  const snapshot = await db.collection('services').orderBy('createdAt','desc').get();
  console.log("Services existants :", snapshot.size);
}

// ===== INITIALISATION =====
window.addEventListener('load', ()=>{
  loadReservations();
  loadServicesDashboard();
});
