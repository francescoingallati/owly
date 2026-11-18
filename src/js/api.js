const BASE_URL = 'https://openlibrary.org';

export async function cercaLibri(categoria) {
  const url = `${BASE_URL}/subjects/${categoria}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Errore ${response.status}`);
  }

  return await response.json();
}