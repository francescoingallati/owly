// Test di api.js con una fetch finta (mock).
// I test non vanno in rete: sono veloci, non dipendono da Open Library
// e si possono simulare anche gli errori (es. 404).

import { describe, test, expect, vi, afterEach } from 'vitest';
import { cercaLibri, cercaDettaglio } from './api.js';

// Crea una fetch finta che risponde con una "busta" decisa da noi.
function fetchFinta(busta) {
    return vi.fn(() => Promise.resolve(busta));
}

afterEach(() => {
    // Rimette la fetch vera: ogni test riparte pulito.
    vi.unstubAllGlobals();
});

describe('cercaLibri', () => {
    test('chiama l\'indirizzo giusto della categoria', async () => {
        const fetch = fetchFinta({ ok: true, json: () => Promise.resolve({ works: [] }) });
        vi.stubGlobal('fetch', fetch);

        await cercaLibri('animals');

        expect(fetch).toHaveBeenCalledWith('https://openlibrary.org/subjects/animals.json');
    });

    test('risposta ok: restituisce i dati (la "lettera")', async () => {
        const dati = { name: 'animals', works: [{ key: '/works/OL1W', title: 'Un libro' }] };
        vi.stubGlobal('fetch', fetchFinta({ ok: true, json: () => Promise.resolve(dati) }));

        const risultato = await cercaLibri('animals');

        expect(risultato).toEqual(dati);
    });

    test('risposta non ok (404): lancia un errore', async () => {
        vi.stubGlobal('fetch', fetchFinta({ ok: false, status: 404 }));

        await expect(cercaLibri('animals')).rejects.toThrow('Errore 404');
    });

    test('rete assente: l\'errore della fetch arriva a chi chiama', async () => {
        vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new TypeError('NetworkError'))));

        await expect(cercaLibri('animals')).rejects.toThrow('NetworkError');
    });
});

describe('cercaDettaglio', () => {
    test('costruisce l\'indirizzo dalla key (senza doppio slash)', async () => {
        const fetch = fetchFinta({ ok: true, json: () => Promise.resolve({}) });
        vi.stubGlobal('fetch', fetch);

        await cercaDettaglio('/works/OL138052W');

        expect(fetch).toHaveBeenCalledWith('https://openlibrary.org/works/OL138052W.json');
    });

    test('risposta ok: restituisce il dettaglio del libro', async () => {
        const dettaglio = { title: 'Alice', description: 'Alice cade nella tana' };
        vi.stubGlobal('fetch', fetchFinta({ ok: true, json: () => Promise.resolve(dettaglio) }));

        expect(await cercaDettaglio('/works/OL138052W')).toEqual(dettaglio);
    });

    test('risposta non ok (500): lancia un errore', async () => {
        vi.stubGlobal('fetch', fetchFinta({ ok: false, status: 500 }));

        await expect(cercaDettaglio('/works/OL138052W')).rejects.toThrow('Errore 500');
    });
});