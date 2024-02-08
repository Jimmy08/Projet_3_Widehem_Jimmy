// Fonction pour afficher la page de la galerie
const showGalleryPage = () => {
  console.log('Showing gallery page');
  const galleryContainer = document.getElementById('gallery-container');
  const addProjectFormContainer = document.getElementById('add-project-form-container');

  if (galleryContainer && addProjectFormContainer) {
    galleryContainer.style.display = 'block';
    addProjectFormContainer.style.display = 'none';
  }
};

// Écouteur d'événement lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour charger un fichier
  const loadFile = (event) => {
    const imagePreview = document.getElementById('image-preview');
    const imageIcon = document.getElementById('picture-icon');
    const fileUploadButton = document.querySelector('.custom-file-upload');
  
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
  
      reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        imageIcon.style.display = 'none';
        fileUploadButton.style.display = 'none';
      };
  
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // Fonction pour récupérer et afficher les projets depuis l'API
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
              // Création des éléments HTML pour chaque projet
              const figure = document.createElement('figure');
              const imgContainer = document.createElement('div');
              imgContainer.classList.add('image-container');
              const img = document.createElement('img');
              const figcaption = document.createElement('figcaption');

              img.src = project.imageUrl;
              img.alt = project.title;
              figcaption.textContent = project.title;

              imgContainer.appendChild(img);
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

  // Fonction pour supprimer un projet
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

  // Fonction pour ajouter un projet
  const addProject = (formData) => {
    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('L\'ajout du projet a échoué');
        }
        return response.json();
      })
      .then(data => {
        closeAddProjectForm();
        console.log('bonjour');
        fetchAndDisplayProjects();
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du projet :', error);
      });
  };

  // Éléments HTML récupérés une seule fois pour améliorer les performances
  const addProjectFormContainer = document.getElementById('add-project-form-container');
  const addProjectForm = document.getElementById('add-project-form');
  const addPhotoBtn = document.getElementById('add-photo-btn');

  // Fonction pour ouvrir le formulaire d'ajout de projet
  const openAddProjectForm = () => {
    const modalContent = document.getElementById('modal-content');
    while (modalContent.firstChild) {
      modalContent.removeChild(modalContent.firstChild);
    }

    const addProjectFormCloneContainer = addProjectFormContainer.cloneNode(true);
    addProjectFormCloneContainer.style.display = 'block';
    modalContent.appendChild(addProjectFormCloneContainer);

    modalContainer.style.display = 'block';

    const clonedForm = addProjectFormCloneContainer.querySelector('#add-project-form');
    if (clonedForm) {
      clonedForm.addEventListener('submit', (event) => {
        console.log("Cloned form submit event triggered");
        event.preventDefault();

        const formData = new FormData(clonedForm);
        addProject(formData);
      });
    }

    const imageInput = addProjectFormCloneContainer.querySelector('#image');
    if (imageInput) {
      imageInput.onchange = (event) => {
        loadFile(event);
      };
    }

    const closeModalBtn = addProjectFormCloneContainer.querySelector('#close-modal');
    const backToGalleryBtn = addProjectFormCloneContainer.querySelector('#back-to-gallery');

    // Écouteur pour fermer le formulaire d'ajout de projet
    closeModalBtn.addEventListener('click', () => {
      closeAddProjectForm();
    });

    // Écouteur pour revenir à la galerie
    backToGalleryBtn.addEventListener('click', () => {
      console.log('Back to gallery button clicked');
      backToGallery();
    });
    console.log('Open Add Project Form executed');
  };

// Fonction pour revenir à la galerie
const backToGallery = () => {
  const galleryContainer = document.getElementById('gallery-container');
  const addProjectFormContainer = document.getElementById('add-project-form-container');

  if (!galleryContainer || !addProjectFormContainer) {
    console.error('One or more elements not found');
    return;
  }

  galleryContainer.style.display = 'block';
  addProjectFormContainer.style.display = 'none';
};


  // Fonction pour fermer le formulaire d'ajout de projet
  const closeAddProjectForm = () => {
    console.log('bonjour');
    modalContainer.style.display = 'none';
    console.log('hello');
    addProjectForm.reset();
  };

  // Écouteur d'événement pour ouvrir le formulaire d'ajout de projet
  addPhotoBtn.addEventListener('click', openAddProjectForm);

  // Initialisation d'un ensemble pour les catégories et vérification de l'authentification admin
  const categorySet = new Set();
  const authToken = localStorage.getItem('authToken');
  const isAdminConnected = authToken !== null;

  // Affichage des éléments d'administration si l'utilisateur est connecté en tant qu'admin
  if (isAdminConnected) {
    document.getElementById('editmodebar').style.display = 'flex';
    document.getElementById('modal').style.display = 'block';
    document.getElementById('filters').style.display = 'none';
    document.body.style.paddingTop = '59px';
  } else {
    document.getElementById('filters').style.display = 'flex';
  }

  // Récupération et affichage des projets au chargement de la page
  fetchAndDisplayProjects(categorySet);

  // Écouteurs d'événements pour filtrer les projets par catégorie
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

  // Éléments HTML récupérés une seule fois pour améliorer les performances
  const modalContainer = document.getElementById('modal-container');
  const closeModalBtn = document.getElementById('close-modal');
  const galleryContainer = document.getElementById('gallery-container');

  // Fonction pour ouvrir la fenêtre modale et récupérer les projets
  const openModal = () => {
    modalContainer.style.display = 'block';
    fetchProjects();
  };

  // Fonction pour fermer la fenêtre modale
  const closeModal = () => {
    modalContainer.style.display = 'none';
  };

  // Fonction pour récupérer les projets et les afficher dans la galerie
  const fetchProjects = () => {
    const apiUrl = 'http://localhost:5678/api/works';

    fetch(apiUrl)
      .then(response => response.json())
      .then(projects => {
        galleryContainer.innerHTML = '';

        projects.forEach(project => {
          // Création des éléments HTML pour chaque projet dans la galerie
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

  // Écouteur d'événement pour ouvrir la fenêtre modale
  document.getElementById('modaltext').addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);

  // Écouteur d'événement pour fermer la fenêtre modale en cliquant en dehors de celle-ci
  window.addEventListener('click', (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  });
});
