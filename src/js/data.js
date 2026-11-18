export function preparaCategoria (testo) {
    const categoriaPronta = testo.toLowerCase().replaceAll(" ", "_");
    return categoriaPronta;    
}