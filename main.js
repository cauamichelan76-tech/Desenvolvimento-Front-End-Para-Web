// main.js
// Código global ou funções adicionais podem ir aqui.
// Ex.: animações, menu mobile, etc.

const menuToggle = document.querySelector('.menu-toggle');
const navUl = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navUl.classList.toggle('active');
});
