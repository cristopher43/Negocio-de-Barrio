// Muestra el número con puntos de miles: 1500 -> "1.500"
export function formatoMiles(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') return '';
  const digitos = String(valor).replace(/\D/g, '');
  return digitos ? Number(digitos).toLocaleString('es-CL') : '';
}

// Convierte el texto de vuelta a número: "1.500" -> 1500
export function soloNumero(texto: number | string | null | undefined): number {
  if (texto === null || texto === undefined || texto === '') return 0;
  return Number(String(texto).replace(/\D/g, '')) || 0;
}
