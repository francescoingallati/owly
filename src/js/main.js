import '../css/style.css';

import { preparaCategoria, pulisciLibri } from './data.js';

import { cercaLibri } from './api.js';

import { mostraLibri, mostraMessaggio } from './ui.js';

const categoriaForm = document.getElementById("categoria-form");

const categoriaInput = document.getElementById("categoria-input");

function apriLibro(libro) {
  console.log(libro.key);
}

async function eseguiRicerca(testo){
   if (!testo) {
    mostraMessaggio("Inserisci una categoria valida");
    return;

  }

  const categoriaPronta = preparaCategoria(testo)

  try {
    mostraMessaggio("Sto cercando i tuoi libri ...");
    const dati = await cercaLibri(categoriaPronta);
    const libri = pulisciLibri(dati.works);

    if (libri.length === 0) {
      mostraMessaggio("Nessun libro trovato per questa categoria");
      return;
    }

    mostraMessaggio("");
    mostraLibri(libri, apriLibro);

  } catch (errore) {
    mostraMessaggio("Impossibile caricare i libri. Riprova.");
    console.error(errore); 
  }

}

categoriaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const categoria = categoriaInput.value.trim();
  eseguiRicerca(categoria)
});

const pulsantiCategoria = document.querySelectorAll(".categoria");

pulsantiCategoria.forEach((pulsante) => {
  pulsante.addEventListener("click", () => {
    const categoria = pulsante.dataset.categoria;
    eseguiRicerca(categoria);
  });
});