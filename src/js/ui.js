const listaLibri = document.getElementById("lista-libri");
const messaggi = document.getElementById("messaggi");

export function mostraMessaggio(testo) {
  messaggi.textContent = testo;
}

export function mostraLibri(libri, alClickLibro) {
  listaLibri.textContent = "";

  libri.forEach((libro) => {
    const elemento = document.createElement("li");
    const pulsante = document.createElement("button");
    pulsante.type = "button";
    pulsante.textContent = `${libro.titolo} - ${libro.autori}`;
    pulsante.addEventListener("click", () => alClickLibro(libro));

    elemento.appendChild(pulsante);
    listaLibri.appendChild(elemento);
  });
}

const dettaglio = document.getElementById("dettaglio-libro");
const dettaglioContenuto = document.getElementById("dettaglio-contenuto");
const chiudiDettaglio = document.getElementById("chiudi-dettaglio");

export function apriDettaglio(testo) {
  dettaglioContenuto.textContent = testo;
  if (!dettaglio.open) {
    dettaglio.showModal();
  }
}

export function mostraDettaglio(libro, descrizione) {
  dettaglioContenuto.textContent = "";

  const titolo = document.createElement("h2");
  titolo.textContent = libro.titolo;

  const autori = document.createElement("p");
  autori.textContent = libro.autori;

  const testo = document.createElement("p");
  testo.textContent = descrizione;

  dettaglioContenuto.append(titolo, autori, testo);
}

chiudiDettaglio.addEventListener("click", () => dettaglio.close());

dettaglio.addEventListener("click", (event) => {
  if (event.target === dettaglio) {
    dettaglio.close();
  }
});