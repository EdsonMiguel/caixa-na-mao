 export async function copiarParaAreaDeTransferencia(texto: string){
    try {
      await navigator.clipboard.writeText(texto);
      alert('Relatório copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      // Fallback para dispositivos mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = texto;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Relatório copiado para a área de transferência!');
    }
  };