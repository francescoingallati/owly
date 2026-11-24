// Test di store.js: il pattern Observer.
// Lo store non "restituisce" il suo lavoro: il suo lavoro è CHIAMARE gli iscritti.
// Per questo usiamo vi.fn(): un osservatore finto che registra come è stato chiamato.

import { describe, test, expect, vi, afterEach } from 'vitest';
import { iscriviti, aggiornaStato, leggiStato } from './store.js';

describe('store (Observer)', () => {
  // Lo stato e gli iscritti vivono per tutti i test: dopo ogni test
  // ci disiscriviamo, così nessun osservatore "sporca" i test successivi.
  let disiscriviti;

  afterEach(() => {
    if (disiscriviti) disiscriviti();
    disiscriviti = undefined;
  });

  test('aggiornaStato avvisa l\'iscritto con lo stato nuovo', () => {
    const osservatore = vi.fn();
    disiscriviti = iscriviti(osservatore);

    aggiornaStato({ messaggio: 'Ciao', libri: [] });

    expect(osservatore).toHaveBeenCalledTimes(1);
    expect(osservatore).toHaveBeenCalledWith({ messaggio: 'Ciao', libri: [] });
  });

  test('avvisa tutti gli iscritti, non solo uno', () => {
    const primo = vi.fn();
    const secondo = vi.fn();
    const disiscriviPrimo = iscriviti(primo);
    disiscriviti = iscriviti(secondo);

    aggiornaStato({ messaggio: 'Tutti', libri: [] });

    expect(primo).toHaveBeenCalledTimes(1);
    expect(secondo).toHaveBeenCalledTimes(1);
    disiscriviPrimo();
  });

  test('dopo la disiscrizione l\'osservatore non viene più chiamato', () => {
    const osservatore = vi.fn();
    const esci = iscriviti(osservatore);

    esci();
    aggiornaStato({ messaggio: 'Nessuno ascolta', libri: [] });

    expect(osservatore).not.toHaveBeenCalled();
  });

  test('i cambiamenti si uniscono allo stato: le altre proprietà restano', () => {
    const libri = [{ key: '/works/OL1W', titolo: 'Un libro', autori: 'Anna' }];
    aggiornaStato({ messaggio: '', libri });

    // Cambio solo il messaggio
    aggiornaStato({ messaggio: 'Nuovo messaggio' });

    expect(leggiStato()).toEqual({ messaggio: 'Nuovo messaggio', libri });
  });
});