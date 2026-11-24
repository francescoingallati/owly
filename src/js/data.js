export function preparaCategoria(testo) {
    const risultato = testo.toLowerCase().replaceAll(" ", "_");
    return risultato;
}

export function pulisciLibri(works) {
    return works.map((libro) => ({
        key: libro.key,
        titolo: libro.title,
        autori: estraiAutori(libro.authors)
    }));
}

export function estraiAutori(authors) {
    if (!Array.isArray(authors) || authors.length === 0) {
        return "Autore non specificato";
    }

    const nomi = authors.map((autore) => autore.name);

    const nomiUnici = [...new Set(nomi)];

    return nomiUnici.join(", ");
}

export function estraiDescrizione(description) {
  if (typeof description === 'string') {
    return description;
  }

  if (typeof description === 'object' && description !== null && typeof description.value === 'string') {
    return description.value;
  }

  return 'La descrizione di questo libro non è presente';
}