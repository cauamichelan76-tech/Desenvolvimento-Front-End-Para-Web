document.addEventListener('submit', function(e) {
  if(e.target && e.target.id === 'volunteerForm') {
    e.preventDefault();
    const form = e.target;
    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const feedback = document.getElementById('formFeedback');

    if(nome.length < 3) {
      feedback.textContent = 'Nome deve ter pelo menos 3 caracteres.';
      feedback.style.color = 'red';
      return;
    }

    if(!email.includes('@')) {
      feedback.textContent = 'Email inválido.';
      feedback.style.color = 'red';
      return;
    }

    feedback.textContent = 'Cadastro realizado com sucesso!';
    feedback.style.color = 'green';
    form.reset();
  }
});
