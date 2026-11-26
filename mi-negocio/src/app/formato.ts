// Muestra el número con puntos de miles: 1500 -> "1.500"
export function formatoMiles(valor: number | string): string {
  const digitos = String(valor).replace(/\D/g, '');
  return digitos ? Number(digitos).toLocaleString('es-CL') : '';
}

// Convierte el texto de vuelta a número: "1.500" -> 1500
export function soloNumero(texto: string): number {
  return Number(texto.replace(/\D/g, '')) || 0;
}