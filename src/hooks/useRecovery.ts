import {useState} from 'react';

import {validarEmailRecuperacao} from '../validacao/validacaoRecupera';

export function useRecovery() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [solicitado, setSolicitado] = useState(false);

  function alterarEmail(valor: string) {
    setEmail(valor);
    setErro('');
    setSolicitado(false);
  }

  function solicitarLink() {
    const mensagem = validarEmailRecuperacao(email);

    if (mensagem) {
      setErro(mensagem);
      return;
    }

    setErro('');
    setSolicitado(true);
  }

  return {
    email,
    erro,
    solicitado,
    alterarEmail,
    solicitarLink,
  };
}