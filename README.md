# 🦉 Owly – Cerca libri per categoria

Applicazione web che incentiva la lettura: l'utente sceglie o scrive una categoria, vede l'elenco dei libri (titolo e autori) e, con un click su un libro, ne legge la descrizione. I dati arrivano da [Open Library](https://openlibrary.org/developers/api).

Progetto finale del corso **JavaScript Advanced** di start2impact, per il cliente ipotetico Owly, una piattaforma per la scuola primaria.

**🔗 Demo live:** https://owly-francesco.netlify.app/

---

## Funzionalità

- Ricerca per categoria tramite campo di testo (invio con pulsante o tasto Invio).
- Sei **categorie popolari** cliccabili: etichetta in italiano, ricerca in inglese per avere più risultati.
- Elenco dei libri con **titolo e autori** (autori duplicati rimossi, "Autore non specificato" se mancano).
- **Dettaglio del libro** in una finestra modale (`<dialog>`): seconda chiamata all'API con la `key` del libro.
- Messaggi per ogni situazione: campo vuoto, caricamento, nessun risultato, errore di rete o del server.
- Gestione delle **ricerche sovrapposte**: se l'utente avvia più ricerche di fila, viene mostrata solo l'ultima.
- Accessibilità: elementi cliccabili come `<button>` (usabili da tastiera), `label` collegata all'input, messaggi con `aria-live`, chiusura della finestra con ✕, Esc o click sullo sfondo.
- Sicurezza: i dati esterni sono inseriti solo con `textContent`, mai con `innerHTML` (protezione da XSS).
- Layout responsive (computer, tablet, telefono).

## Tecnologie

- JavaScript (ES Modules), HTML, CSS
- [Vite](https://vite.dev/) per sviluppo e build
- [Vitest](https://vitest.dev/) per i test
- [Netlify](https://www.netlify.com/) per la pubblicazione

## Avvio in locale

Requisito: Node.js 18 o superiore.

```bash
git clone https://github.com/francescoingallati/owly.git
cd owly
npm install
npm run dev       # avvia il server di sviluppo
npm run test      # esegue i test
npm run build     # crea la versione di produzione in dist/
```

## Struttura del progetto

```
owly/
├─ index.html
├─ public/            favicon
└─ src/
   ├─ css/style.css
   ├─ img/            logo
   └─ js/
      ├─ main.js      regista: ascolta l'utente e collega i moduli
      ├─ api.js       chiamate a Open Library (fetch), dati grezzi
      ├─ data.js      funzioni pure: puliscono e trasformano i dati
      ├─ store.js     stato dell'app + pattern Observer
      ├─ ui.js        disegna nella pagina (DOM)
      └─ *.test.js    test Vitest
```

Ogni modulo ha un solo compito e i moduli non si importano tra loro: tutti sono collegati solo a `main.js`. In questo modo la logica delle API è separata dalla UI, `data.js` è testabile senza browser e cambiare una parte (per esempio la fonte dei dati) non obbliga a toccare le altre.

## Design pattern: Observer

`store.js` conserva lo **stato** dell'app (messaggio da mostrare e lista dei libri) e una lista di **osservatori**.

- `iscriviti(osservatore)` aggiunge una funzione alla lista (e restituisce la funzione per disiscriversi);
- `aggiornaStato(cambiamenti)` crea il nuovo stato e avvisa tutti gli iscritti.

In `main.js` la UI si iscrive una volta all'avvio; da quel momento `main.js` non chiama più direttamente la UI, ma aggiorna solo lo stato. **Perché:** chi cambia i dati non deve sapere chi li sta mostrando. La logica (cosa succede) resta separata dalla presentazione (come si vede), e si possono aggiungere altri "spettatori" dello stato senza modificare la logica di ricerca.

## Test

25 test con Vitest, divisi per modulo:

- **`data.test.js`**: le funzioni pure (`preparaCategoria`, `pulisciLibri`, `estraiAutori`, `estraiDescrizione`), compresi i casi limite: autori assenti o duplicati, descrizione come stringa, come oggetto `{ value }`, assente o `null`.
- **`store.test.js`**: il pattern Observer con osservatori finti (`vi.fn()`): notifica, più iscritti, disiscrizione, unione dello stato.
- **`api.test.js`**: le chiamate con una `fetch` finta (mock): URL corretto, risposta ok, errori 404/500, rete assente. I test non vanno in rete.

L'interfaccia (`ui.js`, `main.js`) è stata verificata manualmente: ricerca, categorie, dettaglio, chiusura della finestra, campo vuoto, categoria inesistente, rete lenta e offline.

## Limiti noti e sviluppi futuri

- **Lingua:** le descrizioni arrivano da Open Library, spesso in inglese. L'API delle categorie non ha un filtro per lingua; una possibile evoluzione è usare l'API di ricerca con `language:ita` e, per la traduzione, un servizio esterno chiamato da un backend (una chiave API nel front end sarebbe pubblica).
- **Paginazione:** vengono mostrati i primi 12 libri; l'API supporta `limit` e `offset`, quindi si può aggiungere un pulsante "Carica altri libri".
- **Copertine** dei libri tramite il `cover_id` già presente nei dati.
- **Test end-to-end** dell'interfaccia (Playwright o Cypress).
