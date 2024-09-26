console.log('popup.js est bien chargé');

document.addEventListener('DOMContentLoaded', function() {
  const videoList = document.getElementById('videoList');
  const analysisButton = document.getElementById('analysisButton');
  
  // Fonction pour charger et afficher les vidéos
  function loadAndDisplayVideos() {
      browser.storage.local.get({ watchedVideos: [] }).then(function (result) {
          const watchedVideos = result.watchedVideos;
          console.log("Videos found in storage:", watchedVideos);

          videoList.innerHTML = ''; // Nettoyer la liste existante

          if (watchedVideos.length > 0) {
              watchedVideos.forEach(function (title) {
                  const listItem = document.createElement('li');
                  listItem.classList.add('video-item');

                  let shortTitle = title.length > 40 ? title.substring(0, 40) + "..." : title;

                  const titleElement = document.createElement('span');
                  titleElement.classList.add('video-title');
                  titleElement.textContent = shortTitle;

                  listItem.appendChild(titleElement);
                  videoList.appendChild(listItem);

                  listItem.addEventListener('click', function () {
                      if (listItem.classList.contains('expanded')) {
                          titleElement.textContent = shortTitle;
                          listItem.classList.remove('expanded');
                      } else {
                          titleElement.textContent = title;
                          listItem.classList.add('expanded');
                      }
                  });
              });
          } else {
              const noVideosMsg = document.createElement('li');
              noVideosMsg.textContent = "Aucune vidéo visionnée pour le moment.";
              videoList.appendChild(noVideosMsg);
          }
      });
  }

  // Charger les vidéos au démarrage
  loadAndDisplayVideos();

  const settingsButton = document.getElementById('settingsButton');
  const infoButton = document.getElementById('infoButton');
  const homeSection = document.getElementById('homeSection');
  const settingsSection = document.getElementById('settingsSection');
  const infoSection = document.getElementById('infoSection');
  
  // Fonction pour masquer toutes les sections
  function hideAllSections() {
      homeSection.classList.add('hidden');
      settingsSection.classList.add('hidden');
      infoSection.classList.add('hidden');
  }

  homeButton.addEventListener('click', function() {
    console.log('Le bouton Home a été cliqué.');
    hideAllSections();
    homeSection.classList.remove('hidden');
  });

  // Afficher la section des paramètres lorsque le bouton Paramètres est cliqué
  settingsButton.addEventListener('click', function() {
      console.log('Le bouton Paramètres a été cliqué.');
      hideAllSections();
      settingsSection.classList.remove('hidden');
  });

  // Afficher la section des infos lorsque le bouton Info est cliqué
  infoButton.addEventListener('click', function() {
      console.log('Le bouton Info a été cliqué.');
      hideAllSections();
      infoSection.classList.remove('hidden');
  });

  // Gérer l'événement de soumission du formulaire
  document.getElementById('permissionsForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêcher le rechargement de la page

    const permissions = {};

    // Collecter l'état de chaque permission
    const permissionNames = ['readHistory', 'readRecommendations', 'readMetadata', 'trackViewingTime', 'collectData'];
    permissionNames.forEach(permission => {
        const selectedOption = document.querySelector(`input[name="${permission}"]:checked`);
        permissions[permission] = selectedOption ? selectedOption.value : 'disabled';
    });

    console.log('Permissions sélectionnées:', permissions);

    // Sauvegarder les permissions sélectionnées dans le stockage local
    browser.storage.local.set({ permissions }).then(() => {
        console.log('Permissions enregistrées avec succès:', permissions);
    });
  });

  // Charger les permissions au démarrage
  function loadPermissions() {
    browser.storage.local.get({ permissions: {} }).then(result => {
        const savedPermissions = result.permissions;

        // Cocher les boutons radio correspondants aux permissions sauvegardées
        for (const [key, value] of Object.entries(savedPermissions)) {
            const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
            if (radio) {
                radio.checked = true;
            }
        }
    });
  }

  // Charger les permissions au démarrage
  loadPermissions();

  function createPieChart() {
    const canvas = document.getElementById('categoryChart');
    const ctx = canvas.getContext('2d');
  
    // Données d'exemple
    const data = [20, 30, 25, 15, 10];
    const labels = ['Éducation', 'Divertissement', 'Technologie', 'Musique', 'Voyage'];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    
    const total = data.reduce((a, b) => a + b, 0);
    let startAngle = 0;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;
  
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * (2 * Math.PI); // Angle de chaque tranche
        ctx.beginPath();
        ctx.moveTo(150, 150); // Centre du camembert
        ctx.arc(150, 150, 100, startAngle, startAngle + sliceAngle); // Tracer la tranche
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        startAngle += sliceAngle; // Mettre à jour l'angle de départ
    });
  }
  createPieChart();
});