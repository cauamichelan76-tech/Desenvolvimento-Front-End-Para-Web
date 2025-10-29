const app = document.getElementById('app');

const pages = {
  home: `<h2>Bem-vindo à Pata Voluntária!</h2>
         <p>Conheça nossos projetos e participe como voluntário.</p>`,

  projetos: `<h2>Projetos Sociais</h2>
             <p>Informações sobre adoções e eventos de voluntariado.</p>`,

  cadastro: `<h2>Cadastro de Voluntário</h2>
             <form id="volunteerForm">
               <input type="text" name="nome" placeholder="Nome completo" required>
               <input type="email" name="email" placeholder="Email" required>
               <input type="submit" value="Enviar">
             </form>
             <div id="formFeedback"></div>`
};

// Carregar página inicial
app.innerHTML = pages.home;

// Navegação SPA
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = e.target.dataset.page;
    app.innerHTML = pages[page];
  });
});
