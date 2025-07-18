  export function formatarDiaSemana(dataISO: string){
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { weekday: 'long' });
  };