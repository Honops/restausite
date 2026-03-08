// reservation.js

const reservationForm = document.getElementById('reservationForm');

reservationForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // récupération des données
  const name = document.getElementById('resName').value;
  const email = document.getElementById('resEmail').value;
  const date = document.getElementById('resDate').value;
  const time = document.getElementById('resTime').value;
  const people = document.getElementById('resPeople').value;

  // validation simple
  if(!name || !email || !date || !time || !people){
    alert('Veuillez remplir tous les champs.');
    return;
  }

  // feedback utilisateur
  alert(`Merci ${name}, votre réservation pour ${people} personne(s) le ${date} à ${time} a été prise en compte !`);

  // reset formulaire
  reservationForm.reset();

  // ici tu peux envoyer les données vers Firebase ou ton serveur
});
