export function formatarMoeda(valorMonetario: number){
  return new Intl.NumberFormat('pt-Br', {
    style: 'currency',
    currency: 'BRL'
  }).format(valorMonetario)
}