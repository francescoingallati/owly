// Test di data.js: funzioni pure, quindi niente mock e niente hook.
// Ogni test: prepara l'input → chiama la funzione → controlla il risultato.

import { describe, test, expect } from 'vitest';
import { preparaCategoria, pulisciLibri, estraiAutori, estraiDescrizione } from './data.js';

describe('preparaCategoria', () => {
  test('mette tutto in minuscolo', () => {
    expect(preparaCategoria('Fantasy')).toBe('fantasy');
  });

  test('sostituisce gli spazi con _', () => {
    expect(preparaCategoria('Science Fiction')).toBe('science_fiction');
  });

  test('lascia invariata una categoria già pronta', () => {
    expect(preparaCategoria('animals')).toBe('animals');
  });
});

describe('estraiAutori', () => {
  test('un autore: restituisce il suo nome', () => {
    expect(estraiAutori([{ name: 'Lewis Carroll' }])).toBe('Lewis Carroll');
  });

  test('più autori: li unisce con una virgola', () => {
    expect(estraiAutori([{ name: 'Anna' }, { name: 'Luca' }])).toBe('Anna, Luca');
  });

  test('autore ripetuto: lo mostra una volta sola', () => {
    expect(estraiAutori([{ name: 'Anna' }, { name: 'Anna' }])).toBe('Anna');
  });

  test('array vuoto: testo di riserva', () => {
    expect(estraiAutori([])).toBe('Autore non specificato');
  });

  test('autori assenti (undefined): testo di riserva', () => {
    expect(estraiAutori(undefined)).toBe('Autore non specificato');
  });
});

describe('estraiDescrizione', () => {
  test('descrizione stringa: la restituisce così com\'è', () => {
    expect(estraiDescrizione('Alice cade nella tana')).toBe('Alice cade nella tana');
  });

  test('descrizione oggetto { value }: restituisce value', () => {
    expect(estraiDescrizione({ type: '/type/text', value: 'Alice cade nella tana' }))
      .toBe('Alice cade nella tana');
  });

  test('descrizione assente: testo di riserva', () => {
    expect(estraiDescrizione(undefined)).toBe('La descrizione di questo libro non è presente');
  });

  test('descrizione null: testo di riserva (trappola typeof null)', () => {
    expect(estraiDescrizione(null)).toBe('La descrizione di questo libro non è presente');
  });
});

describe('pulisciLibri', () => {
  test('trasforma i libri grezzi in { key, titolo, autori }', () => {
    // Arrange: due libri come arrivano da Open Library (con campi in più)
    const works = [
      {
        key: '/works/OL138052W',
        title: "Alice's Adventures in Wonderland",
        authors: [{ key: '/authors/OL22098A', name: 'Lewis Carroll' }],
        cover_id: 10527843
      },
      {
        key: '/works/OL1W',
        title: 'Libro senza autore'
      }
    ];

    // Act
    const libri = pulisciLibri(works);

    // Assert: array di oggetti → toEqual (confronta il contenuto)
    expect(libri).toEqual([
      { key: '/works/OL138052W', titolo: "Alice's Adventures in Wonderland", autori: 'Lewis Carroll' },
      { key: '/works/OL1W', titolo: 'Libro senza autore', autori: 'Autore non specificato' }
    ]);
  });

  test('lista vuota: restituisce un array vuoto', () => {
    expect(pulisciLibri([])).toEqual([]);
  });
});