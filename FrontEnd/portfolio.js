fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(projects => {
    const gallery = document.querySelector('.gallery');

    gallery.innerHTML = '';

    projects.forEach(project => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      if (project.imageUrl) {
        img.src = project.imageUrl;
        img.alt = project.title;
        figcaption.textContent = project.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
      } else {
        console.error('L\'URL de l\'image du projet est undefined :', project);
      }
    });
  })
  .catch(error => console.error('Erreur lors de la récupération des projets:', error));
