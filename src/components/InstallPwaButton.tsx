import { useEffect, useState } from 'react';
// Define o tipo para browsers com suporte a PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export function BotaoInstalarPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [podeInstalar, setPodeInstalar] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPodeInstalar(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  async function instalarPWA() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Usuário aceitou a instalação');
    } else {
      console.log('Usuário recusou a instalação');
    }
    setDeferredPrompt(null);
    setPodeInstalar(false);
  };

  if (!podeInstalar) return (
    <div>
      nao pode instalar
    </div>
  );

  return (
    <button
      onClick={instalarPWA}
      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
    >
      Instalar Aplicativo
    </button>
  );
}
