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