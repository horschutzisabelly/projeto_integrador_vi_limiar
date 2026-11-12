import {useState} from 'react';

export type Preferencias = {
  som: boolean;
  notificacoes: boolean;
  volume: number;
};

export function useSettings() {
  const [preferencias, setPreferencias] = useState<Preferencias>({
    som: false,
    notificacoes: false,
    volume: 25,
  });

  const [mensagem, setMensagem] = useState('');

  function alterar<K extends keyof Preferencias>(
    campo: K,
    valor: Preferencias[K],
  ) {
    setPreferencias(atual => ({
      ...atual,
      [campo]: valor,
    }));

    setMensagem('');
  }

  function ajustarVolume(variacao: number) {
    setPreferencias(atual => ({
      ...atual,
      volume: Math.max(0, Math.min(100, atual.volume + variacao)),
    }));

    setMensagem('');
  }

  function salvar() {
    setMensagem('Preferências aplicadas nesta sessão de teste.');
  }

  return {
    preferencias,
    mensagem,
    alterar,
    ajustarVolume,
    salvar,
  };
}