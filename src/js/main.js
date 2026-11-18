import '../css/style.css';

import { preparaCategoria } from './data.js';

import { cercaLibri } from './api.js';

const categoriaForm = document.getElementById("categoria-form");

const categoriaInput = document.getElementById("categoria-input");

categoriaForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const categoria = categoriaInput.value.trim();
  
  if (!categoria) {
    console.log("Inserisci una categoria valida")
    return
  }

  const categoriaPronta = preparaCategoria(categoria)
  console.log(categoriaPronta)

    try {                                          
    const dati = await cercaLibri(categoriaPronta);
    console.log(dati.works);
  } catch (errore) {
    console.log("Qualcosa è andato storto:", errore.message);
  }
});