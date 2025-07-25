import { QrCodePix as QrCodePixPromise } from 'qrcode-pix';
import { useEffect, useState } from 'react';

interface QrCodePixProps {
  key: string;
  name: string;
  city: string;
  transactionId: string; // max 25 characters
  message: string;
  cep: string;
  value: number;
}

export function QrCodePix({ value, ...rest }: QrCodePixProps) {
  const [base64, setBase64] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function generateQrCodePix() {
      setIsLoading(true);
      try {
        alert('a');
        const qrCodePix = QrCodePixPromise({
          ...rest,
          version: '01',
          countryCode: '55',
          currency: 0,
          cep: '18652506',
          city: 'sÃO MANUEL',
          key: 'emigueltecv@gmail.com',
          message: 'obrigado',
          name: 'Caixa na mao',
          transactionId: '123',
          value,
        });

        const qrCodeBase64 = await qrCodePix.base64();
        console.log(qrCodeBase64);
        setBase64(qrCodeBase64);
      } catch (error) {
        console.error('Erro ao gerar QR Code Pix:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (value > 0) {
      generateQrCodePix();
    } else {
      setBase64('');
    }
  }, [value, rest]);

  if (isLoading) {
    return <div className="text-center py-4 text-gray-600">Gerando QR Code PIX...</div>;
  }

  if (base64) {
    return (
      <img
        src={base64}
        alt="QR Code Pix"
        className="mx-auto max-w-xs border border-gray-300 rounded"
      />
    );
  }

  return <div className="text-center text-gray-400">Nenhum QR Code disponível</div>;
}
