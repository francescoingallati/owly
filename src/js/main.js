import '../css/style.css';

const formCategoria = document.getElementById("categoria-form");

const inputCategoria = document.getElementById("categoria-input"); 

formCategoria.addEventListener("submit", event => {
  event.preventDefault();

  const categoria = inputCategoria.value;

  console.log(categoria);
});