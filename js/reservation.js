const reservationForm = document.getElementById('reservation');
if(reservationForm){
  reservationForm.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if(!name || !phone || !service || !date || !time){
      alert('Veuillez remplir tous les champs.');
      return;
    }

    try{
      await db.collection('reservations').add({
        name, phone, service, date, time,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert('Réservation enregistrée avec succès !');
      reservationForm.reset();
    } catch(error){
      console.error('Erreur réservation:', error);
      alert('Impossible de réserver. Réessayez plus tard.');
    }
  });
}
