import '../css/style.css';

import { estraiDescrizione, preparaCategoria, pulisciLibri } from './data.js';
import { cercaDettaglio, cercaLibri } from './api.js';
import { mostraLibri, mostraMessaggio, apriDettaglio, mostraDettaglio } from './ui.js';
import { aggiornaStato, iscriviti } from './store.js';

const categoriaForm = document.getElementById("categoria-form");
const categoriaInput = document.getElementById("categoria-input");

// OBSERVER: la UI si iscrive allo stato.
// Ogni volta che lo stato cambia, questa funzione ridisegna la pagina.
iscriviti((stato) => {
  mostraMessaggio(stato.messaggio);
  mostraLibri(stato.libri, apriLibro);
});

// RICERCHE SOVRAPPOSTE: ogni ricerca riceve un numero.
// Quando arriva una risposta, la usiamo solo se è dell'ultima ricerca partita.
let ultimaRicerca = 0;

async function eseguiRicerca(testo) {
  const numeroRicerca = ++ultimaRicerca;
  if (!testo) {
    aggiornaStato({ messaggio: "Inserisci una categoria valida", libri: [] });
    return;
  }
  const categoriaPronta = preparaCategoria(testo);

  aggiornaStato({ messaggio: "Sto cercando i tuoi libri ...", libri: [] });

  try {
    const dati = await cercaLibri(categoriaPronta);

    // Nel frattempo è partita un'altra ricerca? Questa risposta è vecchia: la ignoro.
    if (numeroRicerca !== ultimaRicerca) return;

    const libri = pulisciLibri(dati.works);

    if (libri.length === 0) {
      aggiornaStato({ messaggio: "Nessun libro trovato per questa categoria", libri: [] });
      return;
    }

    aggiornaStato({ messaggio: "", libri });

  } catch (errore) {
    if (numeroRicerca !== ultimaRicerca) return;
    aggiornaStato({ messaggio: "Impossibile caricare i libri. Riprova.", libri: [] });
    console.error(errore);
  }
}

categoriaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const categoria = categoriaInput.value.trim();
  eseguiRicerca(categoria);
});

const pulsantiCategoria = document.querySelectorAll(".categoria");

pulsantiCategoria.forEach((pulsante) => {
  pulsante.addEventListener("click", () => {
    const categoria = pulsante.dataset.categoria;
    categoriaInput.value = pulsante.textContent;
    eseguiRicerca(categoria);
  });
});

// Stessa idea per il dettaglio: conta solo l'ultimo libro cliccato.
let ultimoDettaglio = 0;

async function apriLibro(libro) {
  const numeroDettaglio = ++ultimoDettaglio;
  apriDettaglio("Caricamento della descrizione...");

  try {
    const dettaglio = await cercaDettaglio(libro.key);
    if (numeroDettaglio !== ultimoDettaglio) return;

    const descrizione = estraiDescrizione(dettaglio.description);
    mostraDettaglio(libro, descrizione);
  } catch (errore) {
    if (numeroDettaglio !== ultimoDettaglio) return;
    apriDettaglio("Impossibile caricare la descrizione. Riprova.");
    console.error(errore);
  }
}