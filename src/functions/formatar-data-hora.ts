export function formatarDataHora(dataHora: string){
  const data = new Date(dataHora);
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};