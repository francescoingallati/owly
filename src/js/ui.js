const listaLibri = document.getElementById("lista-libri");
const messaggi = document.getElementById("messaggi");

export function mostraMessaggio(testo) {
  messaggi.textContent = testo;
}

export function mostraLibri(libri) {
  listaLibri.textContent = "";

  libri.forEach((libro) => {
    const elemento = document.createElement("li");
    elemento.textContent = `${libro.titolo} - ${libro.autori}`;
    listaLibri.appendChild(elemento);
  });
}