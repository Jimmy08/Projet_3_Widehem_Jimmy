document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorContainer = document.getElementById('error-container');
  
    if (loginForm && errorContainer) {
      loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
  
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              return response.json();
            } else if (response.status === 401) {
              throw new Error('Non autorisé');
            } else if (response.status === 404) {
              throw new Error('Utilisateur non trouvé');
            } else {
              throw new Error('Erreur inattendue');
            }
          })
          .then((data) => {
            localStorage.setItem('authToken', data.token);
  
            window.location.href = '/FrontEnd/index.html';
          })
          .catch((error) => {
            console.error('Erreur :', error);
            errorContainer.innerHTML = `<p>${error.message}</p>`;
          });
      });
    } else {
      console.error('Les éléments requis ne sont pas présents dans le document.');
    }
  });
  