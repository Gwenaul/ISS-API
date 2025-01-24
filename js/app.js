// Call Dumy Json API Recipes
// Step 1 Call URI (EndPoint ?) http://api.open-notify.org/iss-now.json
// Step 2 Extract Json to explore
// Step 3 Use Resources ? to display
// ? Step 4 Catch get error
// ? Step 5 Finally - Log
const map = L.map("map").setView([0, 0], 4);
// Créer une icône avec CSS
const stationIcon = L.divIcon({
  className: "station-icon", // Nom de la classe CSS définie ci-dessus
  html: `
    <div class="antenna"></div>
    <div class="detector"></div>
    <div class="detector right"></div>
  `,
  // Ajout des antennes et détecteurs latéraux
  // iconSize: [40, 40], // Taille de l'icône
  iconAnchor: [20, 20], // Point d'ancrage du marqueur (au centre de l'icône)
  popupAnchor: [0, -16], // Position du popup (si nécessaire)
});
let marker = L.marker([0, 0], { icon: stationIcon }).addTo(map);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
// Trajectoire de l'ISS
let trajectoire = [];
let ligne = L.polyline(trajectoire, { color: "red" }).addTo(map);
function updateISSPosition() {
  fetch("http://api.open-notify.org/iss-now.json")
    .then((response) => response.json())
    .then((resources) => {
      const { latitude, longitude } = resources.iss_position;
      // Ajouter les coordonnées à la trajectoire
      const newPosition = [latitude, longitude];
      trajectoire.push(newPosition);
      // Mettre à jour la polyline
      ligne.setLatLngs(trajectoire);
      // Supprimer le marqueur précédent s'il existe
      if (marker) {
        marker.remove();
      }
      const $resultDiv = document.querySelector("#results ul");
      // Let's Display
      //   const $liCoor = `<li>
      //             <h3>Longitude: ${longitude}, Latitude: ${latitude}</h3>
      //         </li>`;
      //   $resultDiv.insertAdjacentHTML("beforeend", $liCoor);
      map.setView([latitude, longitude], 3);
      marker.setLatLng(newPosition);
      marker = L.marker(newPosition, { icon: stationIcon }).addTo(map);
    });
}
// Mettre à jour la position toutes les 5 secondes
setInterval(updateISSPosition, 1000);
// updateISSPosition();
