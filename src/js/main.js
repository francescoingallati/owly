import '../css/style.css';

import { estraiDescrizione, preparaCategoria, pulisciLibri } from './data.js';

import { cercaDettaglio, cercaLibri } from './api.js';

import { mostraLibri, mostraMessaggio, apriDettaglio, mostraDettaglio } from './ui.js';

const categoriaForm = document.getElementById("categoria-form");

const categoriaInput = document.getElementById("categoria-input");

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

async function apriLibro(libro) {
  apriDettaglio("Caricamento della descrizione...");
  try{
    const dettaglio = await cercaDettaglio(libro.key);

    const descrizione = estraiDescrizione(dettaglio.description);

    mostraDettaglio(libro, descrizione)  
  }

  catch (errore) {
    apriDettaglio("Impossibile caricare la descrizione. Riprova.");
    console.error(errore); 
  }
}