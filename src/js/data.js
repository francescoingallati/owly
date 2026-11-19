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
    // 1. nessun autore? valore di riserva
    if (!Array.isArray(authors) || authors.length === 0) {
        return "Autore non specificato";
    }

    // 2. prendi solo i nomi
    const nomi = authors.map((autore) => autore.name);

    // 3. togli i doppioni
    const nomiUnici = [...new Set(nomi)];

    // 4. uniscili in una sola stringa
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