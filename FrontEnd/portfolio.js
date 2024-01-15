document.addEventListener('DOMContentLoaded', () => {
  const fetchAndDisplayProjects = (categorySet) => {
    const apiUrl = 'http://localhost:5678/api/works';

    fetch(apiUrl)
      .then(response => response.json())
      .then(projects => {
        const gallery = document.querySelector('.gallery');
        gallery.innerHTML = '';

        projects.forEach(project => {
          if (project.imageUrl) {
            if (categorySet.size === 0 || categorySet.has(project.categoryId)) {
              const figure = document.createElement('figure');
              const imgContainer = document.createElement('div');
              imgContainer.classList.add('image-container');
              const img = document.createElement('img');
              const figcaption = document.createElement('figcaption');

              img.src = project.imageUrl;
              img.alt = project.title;
              figcaption.textContent = project.title;

              imgContainer.appendChild(img);

              const deleteIcon = document.createElement('i');
              deleteIcon.classList.add('fa-solid', 'fa-trash');
              deleteIcon.addEventListener('click', () => {
                deleteProject(project.id);
              });
              imgContainer.appendChild(deleteIcon);

              figure.appendChild(imgContainer);
              figure.appendChild(figcaption);

              gallery.appendChild(figure);
            }
          } else {
            console.error('L\'URL de l\'image du projet est undefined :', project);
          }
        });
      })
      .catch(error => console.error('Erreur lors de la récupération des projets :', error));
  };

  const deleteProject = (projectId) => {
    const apiUrl = `http://localhost:5678/api/works/${projectId}`;

    fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    })
    
    .then(response => {
      if (!response.ok) {
        throw new Error('La suppression a échoué');
      }
      return response.json();
    })
    .then(data => {
      const deletedProjectElement = document.getElementById(`project-${projectId}`);
      if (deletedProjectElement) {
        deletedProjectElement.remove();
      }
    })
    .catch(error => {
      console.error('Erreur lors de la suppression :', error);
    });
  };

  const categorySet = new Set();

  const authToken = localStorage.getItem('authToken');
  const isAdminConnected = authToken !== null;

  if (isAdminConnected) {
    document.getElementById('editmodebar').style.display = 'flex';
    document.getElementById('modal').style.display = 'block';
    document.getElementById('filters').style.display = 'none';
    document.body.style.paddingTop = '59px';
  } else {
    document.getElementById('filters').style.display = 'flex';
  }

  fetchAndDisplayProjects(categorySet);

  document.getElementById('all').addEventListener('click', () => {
    categorySet.clear();
    fetchAndDisplayProjects(categorySet);
  });

  document.getElementById('objects').addEventListener('click', () => {
    categorySet.clear();
    categorySet.add(1);
    fetchAndDisplayProjects(categorySet);
  });

  document.getElementById('appartements').addEventListener('click', () => {
    categorySet.clear();
    categorySet.add(2);
    fetchAndDisplayProjects(categorySet);
  });

  document.getElementById('hotels').addEventListener('click', () => {
    categorySet.clear();
    categorySet.add(3);
    fetchAndDisplayProjects(categorySet);
  });

  const modalContainer = document.getElementById('modal-container');
  const closeModalBtn = document.getElementById('close-modal');
  const addPhotoBtn = document.getElementById('add-photo-btn');
  const galleryContainer = document.getElementById('gallery-container');

  const openModal = () => {
    modalContainer.style.display = 'block';
    fetchProjects();
  };

  const closeModal = () => {
    modalContainer.style.display = 'none';
  };

  const fetchProjects = () => {
    const apiUrl = 'http://localhost:5678/api/works';

    fetch(apiUrl)
      .then(response => response.json())
      .then(projects => {
        galleryContainer.innerHTML = '';

        projects.forEach(project => {
          const projectContainer = document.createElement('div');
          projectContainer.classList.add('image-container');

          const projectImage = document.createElement('img');
          projectImage.src = project.imageUrl;
          projectImage.alt = project.title;

          const deleteIcon = document.createElement('i');
          deleteIcon.classList.add('fa-solid', 'fa-trash');
          deleteIcon.addEventListener('click', () => {
            deleteProject(project.id);
          });

          projectContainer.appendChild(projectImage);
          projectContainer.appendChild(deleteIcon);
          galleryContainer.appendChild(projectContainer);
        });
      })
      .catch(error => console.error('Erreur lors de la récupération des projets pour la galerie :', error));
  };

  document.getElementById('modaltext').addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  });

  addPhotoBtn.addEventListener('click', () => {
    // Ajoutez ici le code pour gérer l'ajout d'une photo
    // Vous pouvez appeler une fonction ou ouvrir une autre fenêtre modale, par exemple
  });
});
