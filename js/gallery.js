const galleryContainer = document.getElementById('galleryContainer');
if(galleryContainer){
  async function loadGallery(){
    galleryContainer.innerHTML = '<p>Chargement de la galerie...</p>';

    try{
      const snapshot = await db.collection('services').orderBy('createdAt','desc').get();
      galleryContainer.innerHTML = '';

      snapshot.forEach(doc=>{
        const data = doc.data();
        const div = document.createElement('div');
        div.classList.add('gallery-item');

        if(data.type === 'image'){
          div.innerHTML = `<img src="${data.mediaUrl}" alt="${data.name}" class="gallery-media">`;
        } else {
          div.innerHTML = `<video src="${data.mediaUrl}" controls class="gallery-media"></video>`;
        }

        galleryContainer.appendChild(div);
      });

      // Zoom overlay
      document.querySelectorAll('.gallery-media').forEach(media=>{
        media.addEventListener('click', ()=>{
          const overlay = document.createElement('div');
          overlay.classList.add('overlay');
          overlay.innerHTML = `<div class="overlay-content">${media.outerHTML}</div>`;
          document.body.appendChild(overlay);
          overlay.addEventListener('click', ()=> overlay.remove());
        });
      });

    } catch(error){
      console.error('Erreur galerie:', error);
      galleryContainer.innerHTML = '<p>Impossible de charger la galerie.</p>';
    }
  }

  window.addEventListener('load', loadGallery);
}
