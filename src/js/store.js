// Lo stato dell'app e l'Observer.
// Lo stato è la "fotografia" di ciò che l'app sa in questo momento.
// Chi vuole essere avvisato quando cambia, si iscrive con iscriviti().

const osservatori = new Set();

let stato = {
  messaggio: "",
  libri: []
};

export function leggiStato() {
  return stato;
}

// Aggiunge un osservatore alla lista.
// Restituisce una funzione per disiscriversi.
export function iscriviti(osservatore) {
  osservatori.add(osservatore);
  return () => osservatori.delete(osservatore);
}

// Crea uno stato nuovo con i cambiamenti e avvisa tutti gli iscritti.
export function aggiornaStato(cambiamenti) {
  stato = { ...stato, ...cambiamenti };
  osservatori.forEach((osservatore) => osservatore(stato));
}
